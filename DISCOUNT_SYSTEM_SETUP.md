# Discount System Setup Guide

## Database Migration Required

Run this SQL in your Supabase SQL Editor to link products with discounts:

```sql
-- Add discount_id column to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS discount_id UUID NULL,
ADD CONSTRAINT products_discount_id_fkey
  FOREIGN KEY (discount_id)
  REFERENCES discounts (id)
  ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_discount_id ON products(discount_id);
```

## How It Works

### Your Existing Tables
- ✅ `discounts` table - Already exists with code, type, value, dates
- ✅ `products` table - Already exists
- ✅ `categories` table - Already exists

### What Was Added
- ✅ `discount_id` column in products table (foreign key to discounts)
- ✅ Admin UI for managing discounts at `/admin/discounts`
- ✅ Product forms now have a discount selector dropdown
- ✅ Frontend displays discount badges and crossed-out prices
- ✅ Smart discount validation (checks active status and date ranges)

## Features Implemented

### 1. Discount Management (`/admin/discounts`)
- Create, edit, and delete discounts
- Set discount type (percentage or fixed amount)
- Optional discount codes
- Start and expiry dates
- Active/inactive toggle

### 2. Product Forms
- New product: Select discount from dropdown
- Edit product: Change or remove discount
- Link to manage discounts

### 3. Frontend Display
- Product Cards: Red discount badge with percentage/amount
- Product Detail Page: Shows original price struck through + discounted price
- Smart validation: Only shows active, non-expired discounts

### 4. Discount Calculation
- Automatic price calculation based on discount type
- Validates discount is active and within date range
- Returns original price if discount is invalid

## Usage

### Create a Discount
1. Go to `/admin/discounts`
2. Click "Add Discount"
3. Set type (percentage or fixed)
4. Set value (e.g., 20 for 20% or 10.00 for 10 TND off)
5. Optional: Add code, dates, description

### Apply to Products
1. Go to `/admin/products/new` or edit existing product
2. Select discount from dropdown
3. Save product

### Frontend Result
- Discount badge appears on product card
- Price shows: ~~100 TND~~ **80 TND** (for 20% off)
- Badge shows "-20%" or "-10 TND"

## File Structure

```
app/admin/
├── discounts/page.tsx          # Discount management UI
├── products/new/page.tsx        # Updated with discount selector
└── products/[id]/page.tsx       # Updated with discount selector

lib/pricing.ts                   # Discount calculation logic

types/index.ts                   # Added Discount interface

components/products/
└── ProductCard.tsx              # Shows discount badge

app/shop/
├── page.tsx                     # Product list with discounts
└── [slug]/page.tsx              # Product detail with discounts
```

## Benefits of This Approach

1. **Reusable Discounts** - Create once, apply to many products
2. **Centralized Management** - All discounts in one place
3. **Time-Based** - Auto-activate/deactivate based on dates
4. **Flexible** - Both percentage and fixed amount types
5. **Optional Codes** - For coupon-style discounts
6. **Clean Database** - Normalized structure, no duplicate data

## Next Steps (Optional)

- Add bulk discount assignment (apply to multiple products at once)
- Add discount usage tracking
- Add category-level discounts
- Add customer-specific discounts
- Add minimum purchase requirements
