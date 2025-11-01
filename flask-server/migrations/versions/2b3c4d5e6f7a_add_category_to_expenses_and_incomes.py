"""Add category_id to expenses and incomes

Revision ID: 2b3c4d5e6f7a
Revises: 1afa58c9fe6d
Create Date: 2025-11-01 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '2b3c4d5e6f7a'
down_revision = '1afa58c9fe6d'
branch_labels = None
depends_on = None


def upgrade():
    # Add category_id to expenses
    op.add_column('expenses', sa.Column('category_id', sa.BigInteger(), nullable=True))
    op.create_foreign_key(
        'fk_expenses_category_id_categories',
        'expenses', 'categories',
        ['category_id'], ['id']
    )
    op.create_index('ix_expenses_user_category_date', 'expenses', ['user_id', 'category_id', 'date_spent'])

    # Add category_id to incomes (optional)
    op.add_column('incomes', sa.Column('category_id', sa.BigInteger(), nullable=True))
    op.create_foreign_key(
        'fk_incomes_category_id_categories',
        'incomes', 'categories',
        ['category_id'], ['id']
    )
    op.create_index('ix_incomes_user_category_received', 'incomes', ['user_id', 'category_id', 'received_at'])


def downgrade():
    # Drop income indexes and FKs
    op.drop_index('ix_incomes_user_category_received', table_name='incomes')
    op.drop_constraint('fk_incomes_category_id_categories', 'incomes', type_='foreignkey')
    op.drop_column('incomes', 'category_id')

    # Drop expense indexes and FKs
    op.drop_index('ix_expenses_user_category_date', table_name='expenses')
    op.drop_constraint('fk_expenses_category_id_categories', 'expenses', type_='foreignkey')
    op.drop_column('expenses', 'category_id')
