from typing import List, Optional
from sqlalchemy import desc, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from app.models.project import Project
from app.models.scan import Scan
from app.schemas.project import ProjectCreate, ProjectResponse, ProjectSummaryScan, ProjectUpdate


class ProjectService:
    @staticmethod
    async def create_project(
        db: AsyncSession,
        data: ProjectCreate,
        user_id: Optional[str] = None,
    ) -> Project:
        """Create a new website project."""
        settings = {
            "crawl_limit": 100,
            "respect_robots": True,
            "follow_external_links": False,
            "include_subdomains": False,
        }
        if data.settings:
            settings.update(data.settings)

        project = Project(
            user_id=user_id,
            name=data.name,
            domain=data.domain,
            description=data.description,
            settings=settings,
        )
        db.add(project)
        await db.commit()
        await db.refresh(project)
        return project

    @staticmethod
    async def get_projects(
        db: AsyncSession,
        skip: int = 0,
        limit: int = 100,
        search: Optional[str] = None,
    ) -> tuple[List[Project], int]:
        """List all projects with total count and latest scan info."""
        query = select(Project).options(
            selectinload(Project.scans)
        ).order_by(desc(Project.created_at))

        if search:
            search_filter = f"%{search.lower()}%"
            query = query.where(
                func.lower(Project.name).like(search_filter)
                | func.lower(Project.domain).like(search_filter)
            )

        # Count total
        count_query = select(func.count(Project.id))
        if search:
            search_filter = f"%{search.lower()}%"
            count_query = count_query.where(
                func.lower(Project.name).like(search_filter)
                | func.lower(Project.domain).like(search_filter)
            )
        total_res = await db.execute(count_query)
        total = total_res.scalar() or 0

        # Paginated results
        query = query.offset(skip).limit(limit)
        result = await db.execute(query)
        projects = list(result.scalars().all())

        return projects, total

    @staticmethod
    async def get_project_by_id(
        db: AsyncSession,
        project_id: str,
    ) -> Optional[Project]:
        """Get single project by ID with scans."""
        query = (
            select(Project)
            .where(Project.id == project_id)
            .options(selectinload(Project.scans))
        )
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def get_project_by_domain(
        db: AsyncSession,
        domain: str,
    ) -> Optional[Project]:
        """Find project by normalized domain."""
        query = select(Project).where(Project.domain == domain)
        result = await db.execute(query)
        return result.scalar_one_or_none()

    @staticmethod
    async def update_project(
        db: AsyncSession,
        project_id: str,
        data: ProjectUpdate,
    ) -> Optional[Project]:
        """Update an existing project."""
        project = await ProjectService.get_project_by_id(db, project_id)
        if not project:
            return None

        update_data = data.model_dump(exclude_unset=True)
        for field, val in update_data.items():
            setattr(project, field, val)

        await db.commit()
        await db.refresh(project)
        return project

    @staticmethod
    async def delete_project(
        db: AsyncSession,
        project_id: str,
    ) -> bool:
        """Delete a project and all associated scans."""
        project = await ProjectService.get_project_by_id(db, project_id)
        if not project:
            return False

        await db.delete(project)
        await db.commit()
        return True

    @staticmethod
    def map_to_response(project: Project) -> ProjectResponse:
        """Map Project ORM to ProjectResponse schema with latest scan summary."""
        latest_scan = None
        if project.scans:
            latest = project.scans[0]
            latest_scan = ProjectSummaryScan(
                id=latest.id,
                status=latest.status,
                progress=latest.progress,
                current_step=latest.current_step,
                overall_score=latest.overall_score,
                created_at=latest.created_at,
            )

        website_url = f"https://{project.domain}"

        return ProjectResponse(
            id=project.id,
            user_id=project.user_id,
            name=project.name,
            domain=project.domain,
            website_url=website_url,
            description=project.description,
            is_active=project.is_active,
            settings=project.settings or {},
            created_at=project.created_at,
            updated_at=project.updated_at,
            latest_scan=latest_scan,
            total_scans=len(project.scans) if project.scans else 0,
        )
