# Modern Clothing E-Commerce Platform

A beautiful, fast, and modern e-commerce platform designed specifically for clothing Instagram brands. Built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## Features

### Customer-Facing Store
- **Modern Design**: Clean, aesthetic UI with smooth animations
- **Product Catalog**: Browse products with filtering by category
- **Product Details**: Image galleries, variant selection (sizes/colors), stock management
- **Shopping Cart**: Persistent cart with quantity management
- **Multiple Checkout Options**:
  - WhatsApp checkout (perfect for Tunisia/MENA markets)
  - Standard checkout with order creation
- **Mobile-First**: Fully responsive design optimized for mobile shopping
- **Instagram Integration**: Ready for Instagram feed embedding

### Admin Dashboard
- **Dashboard Overview**: Sales metrics, order statistics, revenue tracking
- **Product Management**: Full CRUD operations for products
- **Order Management**: View and update order statuses
- **Category Management**: Organize products by categories
- **Image Management**: Upload product images to Supabase Storage

### Technical Features
- **Fast Performance**: Optimized images, lazy loading, efficient queries
- **Type Safety**: Full TypeScript implementation
- **State Management**: Zustand for cart state with persistence
- **Database**: Supabase (PostgreSQL) with row-level security
- **Authentication**: Ready for Supabase Auth integration
- **Real-time**: Built on Supabase real-time capabilities

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ClothingECommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**

   - Create a new Supabase project at [supabase.com](https://supabase.com)
   - Run the SQL schema provided in your Supabase SQL editor
   - Get your project URL and anon key from Settings > API

4. **Configure environment variables**

   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

   # Site Configuration
   NEXT_PUBLIC_SITE_NAME=Your Store Name
   NEXT_PUBLIC_WHATSAPP_NUMBER=21612345678
   NEXT_PUBLIC_CURRENCY=TND
   ```

5. **Set up Supabase Storage**

   In your Supabase dashboard:
   - Go to Storage
   - Create a new bucket called `product-images`
   - Set it to public
   - Update bucket policies to allow uploads

6. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/
│   ├── admin/              # Admin dashboard
│   │   ├── orders/         # Order management
│   │   ├── products/       # Product management
│   │   └── page.tsx        # Dashboard overview
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout flow
│   ├── shop/               # Product catalog
│   │   └── [slug]/         # Product detail pages
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/
│   ├── layout/             # Header, Footer
│   ├── products/           # Product components
│   └── ui/                 # Reusable UI components
├── lib/
│   └── supabase.ts         # Supabase client
├── store/
│   └── cart.ts             # Cart state management
└── types/
    ├── database.ts         # Database types
    └── index.ts            # App types
```

## Customization

### Branding

1. Update site name in `.env.local`
2. Modify colors in `tailwind.config.ts`
3. Replace fonts in `app/layout.tsx`

### Add Sample Data

Use the Supabase dashboard to add:
- Categories (e.g., "T-Shirts", "Hoodies", "Accessories")
- Products with images
- Variants (sizes, colors)

### WhatsApp Integration

Update the WhatsApp number in `.env.local`. The checkout will generate a formatted message with order details.

## Deployment

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to add all variables from `.env.local` to your deployment platform.

## Multi-Tenancy

To sell this platform to multiple clients:

### Option 1: Separate Deployments
- Each client gets their own Vercel project
- Each client gets their own Supabase project
- Easy isolation, higher costs

### Option 2: Single Codebase with Tenant ID
- Add `tenant_id` to all database tables
- Use subdomain/custom domain routing
- Update RLS policies for tenant isolation
- More complex, lower costs

## Features to Add

- [ ] Stripe payment integration
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Inventory management
- [ ] Discount codes system
- [ ] Multi-language support
- [ ] Instagram feed widget
- [ ] Product recommendations
- [ ] SEO optimization
- [ ] Admin authentication

## Security Notes

- Set up Row Level Security (RLS) on all Supabase tables
- Implement admin authentication
- Validate all user inputs
- Use environment variables for sensitive data
- Enable HTTPS in production

## Performance Optimization

- Images are optimized with Next.js Image component
- Products are paginated in the database query
- Cart state is persisted to localStorage
- Loading states prevent layout shifts
- Lazy loading for below-fold content

## Support

For issues and questions:
- Check the [Supabase documentation](https://supabase.com/docs)
- Review [Next.js documentation](https://nextjs.org/docs)
- Open an issue in this repository

## License

ISC

---

Built with ❤️ for Instagram clothing brands
