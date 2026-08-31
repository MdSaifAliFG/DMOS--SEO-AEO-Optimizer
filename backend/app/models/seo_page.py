from typing import TYPE_CHECKING, Any, Dict, List, Optional
from sqlalchemy import Boolean, Float, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from app.models.base import TimestampMixin, generate_uuid

if TYPE_CHECKING:
    from app.models.scan import Scan
    from app.models.seo_issue import SeoIssue


class SeoPage(Base, TimestampMixin):
    """Crawled HTML webpage model with extracted SEO metadata."""
    __tablename__ = "seo_pages"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    scan_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("scans.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    url: Mapped[str] = mapped_column(
        String(1024),
        nullable=False,
        index=True,
    )
    final_url: Mapped[str] = mapped_column(
        String(1024),
        nullable=False,
    )
    status_code: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        index=True,
    )
    content_type: Mapped[str] = mapped_column(
        String(100),
        default="text/html",
        nullable=False,
    )
    title: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    meta_description: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    canonical_url: Mapped[Optional[str]] = mapped_column(
        String(1024),
        nullable=True,
    )
    robots_directive: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    x_robots_tag: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True,
    )
    language: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )
    h1_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    h2_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    h3_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    headings: Mapped[Dict[str, List[str]]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    word_count: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    response_time: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False,
    )
    content_length: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    is_indexable: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
        index=True,
    )
    is_internal: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    crawl_depth: Mapped[int] = mapped_column(
        Integer,
        default=0,
        nullable=False,
    )
    render_method: Mapped[str] = mapped_column(
        String(50),
        default="http",
        nullable=False,
    )
    redirect_chain: Mapped[List[Dict[str, Any]]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )
    open_graph: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    twitter_card: Mapped[Dict[str, Any]] = mapped_column(
        JSON,
        default=dict,
        nullable=False,
    )
    structured_data: Mapped[List[Dict[str, Any]]] = mapped_column(
        JSON,
        default=list,
        nullable=False,
    )

    # Relationships
    scan: Mapped["Scan"] = relationship(
        "Scan",
        back_populates="pages",
    )
    images: Mapped[List["SeoPageImage"]] = relationship(
        "SeoPageImage",
        back_populates="page",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    links: Mapped[List["SeoPageLink"]] = relationship(
        "SeoPageLink",
        back_populates="page",
        cascade="all, delete-orphan",
        lazy="selectin",
    )
    issues: Mapped[List["SeoIssue"]] = relationship(
        "SeoIssue",
        back_populates="page",
        cascade="all, delete-orphan",
        lazy="selectin",
    )


class SeoPageImage(Base):
    """Extracted image model from a crawled page."""
    __tablename__ = "seo_page_images"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    page_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("seo_pages.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    src: Mapped[str] = mapped_column(
        String(1024),
        nullable=False,
    )
    alt: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,  # None means missing ALT attribute, "" means alt=""
    )
    width: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    height: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    is_internal: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Relationships
    page: Mapped["SeoPage"] = relationship(
        "SeoPage",
        back_populates="images",
    )


class SeoPageLink(Base):
    """Extracted link model from a crawled page."""
    __tablename__ = "seo_page_links"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=generate_uuid,
    )
    page_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("seo_pages.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    target_url: Mapped[str] = mapped_column(
        String(1024),
        nullable=False,
        index=True,
    )
    anchor_text: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )
    link_type: Mapped[str] = mapped_column(
        String(50),
        default="internal",
        nullable=False,  # "internal" | "external"
    )
    status_code: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )
    is_internal: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )
    is_follow: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    # Relationships
    page: Mapped["SeoPage"] = relationship(
        "SeoPage",
        back_populates="links",
    )
