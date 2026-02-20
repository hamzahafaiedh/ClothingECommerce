-- Add is_new_arrival column to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT false;

-- Create an index for faster filtering
CREATE INDEX IF NOT EXISTS idx_products_is_new_arrival ON products(is_new_arrival) WHERE is_new_arrival = true;

-- Optional: Mark products created in the last 30 days as new arrivals initially
UPDATE products SET is_new_arrival = true WHERE created_at > NOW() - INTERVAL '30 days';
