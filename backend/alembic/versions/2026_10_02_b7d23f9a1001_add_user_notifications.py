"""add user notifications and notification states

Revision ID: b7d23f9a1001
Revises: ff4b224fc22c
Create Date: 2026-10-02 10:25:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b7d23f9a1001'
down_revision = 'ff4b224fc22c'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Tables already created with IF NOT EXISTS, ensure idempotency
    op.execute("""
        CREATE TABLE IF NOT EXISTS user_notification_states (
            id VARCHAR(150) PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL,
            notification_id VARCHAR(100) NOT NULL,
            read BOOLEAN NOT NULL DEFAULT FALSE,
            dismissed BOOLEAN NOT NULL DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_user_notif_states_user_id ON user_notification_states(user_id);
        CREATE INDEX IF NOT EXISTS idx_user_notif_states_notif_id ON user_notification_states(notification_id);

        CREATE TABLE IF NOT EXISTS user_notifications (
            id VARCHAR(100) PRIMARY KEY,
            user_id VARCHAR(50) NOT NULL,
            title VARCHAR(255) NOT NULL,
            message TEXT NOT NULL,
            type VARCHAR(50) NOT NULL DEFAULT 'system',
            severity VARCHAR(20) NOT NULL DEFAULT 'info',
            read BOOLEAN NOT NULL DEFAULT FALSE,
            dismissed BOOLEAN NOT NULL DEFAULT FALSE,
            link VARCHAR(255),
            link_text VARCHAR(100),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
        CREATE INDEX IF NOT EXISTS idx_user_notif_user_id ON user_notifications(user_id);
    """)


def downgrade() -> None:
    op.drop_table('user_notifications')
    op.drop_table('user_notification_states')
