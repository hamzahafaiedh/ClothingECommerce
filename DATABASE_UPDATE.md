# Database Update Required

## Add Discount Columns to Products Table

You need to run this SQL in your Supabase SQL Editor to add the discount feature:

### Option 1: Run the Migration File

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/add_discount_columns.sql`
4. Click **Run**

### Option 2: Run This SQL Directly

```sql
-- Add discount columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS discount_type TEXT DEFAULT 'none' CHECK (discount_type IN ('none', 'percentage', 'fixed')),
ADD COLUMN IF NOT EXISTS discount_value DECIMAL(10, 2) DEFAULT NULL;

-- Add comment to explain the columns
COMMENT ON COLUMN products.discount_type IS 'Type of discount: none, percentage, or fixed';
COMMENT ON COLUMN products.discount_value IS 'Discount value (percentage number or fixed amount)';
```

### What This Does

- Adds `discount_type` column with values: 'none', 'percentage', or 'fixed'
- Adds `discount_value` column to store the discount amount
- Sets default value to 'none' for existing products
- Adds constraint to ensure only valid discount types are used

### After Running the Migration

1. The error should disappear
2. You can now create/edit products with discounts
3. Existing products will have `discount_type = 'none'` by default

---

## Verify It Worked

After running the SQL, refresh your app and try:
1. Go to `/admin/products/new`
2. You should see the discount fields
3. Create a product with a discount
4. Check the shop page to see the discount badge
