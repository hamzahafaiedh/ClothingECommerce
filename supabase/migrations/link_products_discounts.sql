-- Add discount_id column to products table to link with discounts
ALTER TABLE products
ADD COLUMN IF NOT EXISTS discount_id UUID NULL,
ADD CONSTRAINT products_discount_id_fkey
  FOREIGN KEY (discount_id)
  REFERENCES discounts (id)
  ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_discount_id ON products(discount_id);

-- Comment
COMMENT ON COLUMN products.discount_id IS 'Foreign key to discounts table';
