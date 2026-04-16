export const CATEGORIES = [
  { id: 'header',     label: 'Header',     icon: 'LayoutTemplate' },
  { id: 'hero',       label: 'Hero',       icon: 'Image' },
  { id: 'content',    label: 'Content',    icon: 'AlignLeft' },
  { id: 'images',     label: 'Images',     icon: 'ImageIcon' },
  { id: 'cta',        label: 'CTA',        icon: 'Zap' },
  { id: 'ecommerce',  label: 'Ecommerce',  icon: 'ShoppingCart' },
  { id: 'card',       label: 'Cards',      icon: 'CreditCard' },
  { id: 'buttons',    label: 'Buttons',    icon: 'MousePointerClick' },
  { id: 'surveys',    label: 'Surveys',    icon: 'ClipboardList' },
  { id: 'carousel',   label: 'Carousel',   icon: 'GalleryHorizontal' },
  { id: 'footer',     label: 'Footer',     icon: 'PanelBottom' },
];

export const ELEMENT_TEMPLATES = {
  header: [
    {
      id: 'header-logo-center',
      label: 'Centered Logo',
      thumbnail: 'header-1',
      defaults: { logoUrl: 'https://via.placeholder.com/150x50/4F46E5/FFFFFF?text=LOGO', backgroundColor: '#ffffff', borderBottom: '2px solid #e5e7eb', align: 'center' },
    },
    {
      id: 'header-logo-left',
      label: 'Logo Left + Nav',
      thumbnail: 'header-2',
      defaults: { logoUrl: 'https://via.placeholder.com/120x40/4F46E5/FFFFFF?text=LOGO', backgroundColor: '#1e1b4b', navLinks: ['Home', 'Products', 'Contact'], align: 'left' },
    },
    {
      id: 'header-banner',
      label: 'Full Banner Header',
      thumbnail: 'header-3',
      defaults: { backgroundColor: '#4F46E5', title: 'Monthly Newsletter', subtitle: 'April 2025', textColor: '#ffffff' },
    },
    {
      id: 'header-minimal',
      label: 'Minimal Line',
      thumbnail: 'header-4',
      defaults: { backgroundColor: '#f9fafb', title: 'Your Company', borderBottom: '3px solid #4F46E5', textColor: '#111827' },
    },
    {
      id: 'header-dark',
      label: 'Dark Header',
      thumbnail: 'header-5',
      defaults: { logoUrl: 'https://via.placeholder.com/140x44/ffffff/4F46E5?text=LOGO', backgroundColor: '#111827', textColor: '#ffffff', tagline: 'Premium Newsletter' },
    },
    {
      id: 'header-logo-tagline',
      label: 'Logo + Tagline',
      thumbnail: 'header-6',
      defaults: { logoUrl: 'https://via.placeholder.com/140x44/4F46E5/FFFFFF?text=BRAND', tagline: 'Your weekly digest', backgroundColor: '#ffffff', textColor: '#6b7280', align: 'center' },
    },
    {
      id: 'header-gradient',
      label: 'Gradient Header',
      thumbnail: 'header-7',
      defaults: { title: 'The Weekly Digest', subtitle: 'Curated just for you', gradientFrom: '#6366f1', gradientTo: '#8b5cf6', textColor: '#ffffff' },
    },
    {
      id: 'header-announcement',
      label: 'Announcement Bar',
      thumbnail: 'header-8',
      defaults: { message: '🚀 New features just dropped — check them out!', link: '#', linkLabel: 'Learn more', backgroundColor: '#fef3c7', textColor: '#92400e' },
    },
  ],
  // ── HERO ──────────────────────────────────────────────────────────────────
  hero: [
    {
      id: 'hero-fullwidth',
      label: '1 Full-Width Image',
      thumbnail: 'hero-1',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=280&fit=crop', alt: 'Hero Image', link: '#' },
    },
    {
      id: 'hero-overlay',
      label: 'Image + Text Overlay',
      thumbnail: 'hero-2',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=300&fit=crop', overlayText: 'Big Sale This Weekend', overlaySubtext: 'Up to 50% off on all items', overlayColor: 'rgba(0,0,0,0.52)', textColor: '#ffffff' },
    },
    {
      id: 'hero-split',
      label: 'Image Right + Text',
      thumbnail: 'hero-3',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=300&h=260&fit=crop', title: 'Introducing Our New Product', body: 'Experience the future of innovation.', ctaLabel: 'Learn More', ctaLink: '#', backgroundColor: '#f5f3ff' },
    },
    {
      id: 'hero-split-left',
      label: 'Image Left + Text',
      thumbnail: 'hero-4',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=300&h=260&fit=crop', title: 'Revamp Your Space', body: 'Minimalist design with ample workspace.', ctaLabel: 'Shop Now', ctaLink: '#', backgroundColor: '#fafaf9' },
    },
    {
      id: 'hero-video',
      label: 'Video Thumbnail',
      thumbnail: 'hero-5',
      defaults: { thumbnailUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=300&fit=crop', videoLink: '#', title: 'Watch Our Story', backgroundColor: '#111827' },
    },
    {
      id: 'hero-centered-text',
      label: 'Centered Text + CTA',
      thumbnail: 'hero-6',
      defaults: { title: 'Welcome Back', subtitle: 'Your April edition is here. Discover what\'s new.', ctaLabel: 'Read More', ctaLink: '#', backgroundColor: '#f0f9ff', textColor: '#0c4a6e' },
    },
  ],

  // ── CONTENT ───────────────────────────────────────────────────────────────
  content: [
    {
      id: 'content-single',
      label: 'Single Column Text',
      thumbnail: 'content-1',
      defaults: { title: 'Welcome to Our Newsletter', body: 'We are excited to share the latest news and updates with you. Stay tuned for more exciting content.', textColor: '#374151', titleColor: '#111827', backgroundColor: '#ffffff', align: 'left' },
    },
    {
      id: 'content-two-col',
      label: 'Two Column Text',
      thumbnail: 'content-2',
      defaults: { col1Title: 'Feature One', col1Body: 'Description of your first feature goes here.', col2Title: 'Feature Two', col2Body: 'Description of your second feature goes here.', backgroundColor: '#f9fafb' },
    },
    {
      id: 'content-quote',
      label: 'Pull Quote',
      thumbnail: 'content-3',
      defaults: { quote: '"This product changed the way we work."', attribution: '— Jane Doe, CEO', backgroundColor: '#eff6ff', accentColor: '#3b82f6' },
    },
    {
      id: 'content-numbered',
      label: 'Numbered Steps',
      thumbnail: 'content-4',
      defaults: { title: 'How It Works', steps: ['Sign up for an account', 'Choose your plan', 'Start using the product'], backgroundColor: '#ffffff' },
    },
    {
      id: 'content-update',
      label: 'Blog Update',
      thumbnail: 'content-5',
      defaults: { tags: [{ text: 'New', color: '#6366f1' }], title: 'December Update', body: 'The December Update introduces a completely redesigned Page Panel, adding support for nesting and folders.', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=560&h=220&fit=crop', readMoreLink: '#', readMoreLabel: 'Read more →', backgroundColor: '#ffffff' },
    },
    {
      id: 'content-blog-two-col',
      label: 'Blog Two Columns',
      thumbnail: 'content-6',
      defaults: {
        articles: [
          { tag: 'Creative blog', title: 'Sleek Study', date: 'September 19', body: 'Minimalist design with ample workspace', link: '#', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=240&h=140&fit=crop' },
          { tag: 'Creative blog', title: 'ErgoTech Desk', date: 'December 19', body: 'Ergonomic features for maximum comfort', link: '#', imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=240&h=140&fit=crop' },
        ],
        backgroundColor: '#ffffff',
      },
    },
    {
      id: 'content-checklist',
      label: 'Checklist',
      thumbnail: 'content-7',
      defaults: { title: 'Why Choose Us', items: ['Timeless Charm', 'Functional Beauty', 'Endless Comfort'], imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=200&h=160&fit=crop', backgroundColor: '#fafafa' },
    },
    {
      id: 'content-divider',
      label: 'Section Divider',
      thumbnail: 'content-8',
      defaults: { type: 'line', color: '#e5e7eb', thickness: '1px', marginTop: '16px', marginBottom: '16px' },
    },
    {
      id: 'content-spacer',
      label: 'Spacer',
      thumbnail: 'content-9',
      defaults: { height: '40px', backgroundColor: '#ffffff' },
    },
    {
      id: 'content-three-col',
      label: 'Three Column Text',
      thumbnail: 'content-10',
      defaults: {
        cols: [
          { title: 'Speed', body: 'Lightning-fast delivery every time.' },
          { title: 'Quality', body: 'Crafted with premium materials.' },
          { title: 'Support', body: '24/7 support whenever you need.' },
        ],
        backgroundColor: '#f8fafc',
      },
    },
    {
      id: 'content-intro',
      label: 'Intro + Tag',
      thumbnail: 'content-11',
      defaults: { tags: [{ text: "What's new", color: '#6366f1' }], title: 'All Features', body: 'Discover how to effortlessly blend different styles, textures, and eras for a unique cohesive look.', backgroundColor: '#ffffff', align: 'left' },
    },
  ],

  // ── IMAGES ────────────────────────────────────────────────────────────────
  images: [
    {
      id: 'image-single',
      label: '1 Image',
      thumbnail: 'img-1',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=560&h=320&fit=crop', alt: 'Image', link: '', align: 'center' },
    },
    {
      id: 'image-two-col',
      label: '2 Images',
      thumbnail: 'img-2',
      defaults: { image1Url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=270&h=200&fit=crop', image2Url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=270&h=200&fit=crop', alt1: 'Image 1', alt2: 'Image 2', link1: '', link2: '' },
    },
    {
      id: 'image-three-col',
      label: '3 Images',
      thumbnail: 'img-3',
      defaults: { image1Url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=180&h=160&fit=crop', image2Url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=180&h=160&fit=crop', image3Url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=180&h=160&fit=crop', link1: '', link2: '', link3: '' },
    },
    {
      id: 'image-grid-2x2',
      label: '2×2 Grid',
      thumbnail: 'img-4',
      defaults: {
        images: [
          { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=270&h=180&fit=crop', link: '' },
          { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=270&h=180&fit=crop', link: '' },
          { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=270&h=180&fit=crop', link: '' },
          { url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=270&h=180&fit=crop', link: '' },
        ],
      },
    },
    {
      id: 'image-grid-3-horizontal',
      label: '3 Images Grid Horizontal',
      thumbnail: 'img-5',
      defaults: {
        images: [
          { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=180&h=120&fit=crop', link: '' },
          { url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=180&h=120&fit=crop', link: '' },
          { url: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=180&h=120&fit=crop', link: '' },
        ],
      },
    },
    {
      id: 'image-caption',
      label: 'Image + Caption',
      thumbnail: 'img-6',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=560&h=250&fit=crop', caption: 'A beautiful photo caption goes here.', alt: 'Photo', align: 'center' },
    },
    {
      id: 'image-left-text',
      label: 'Image Left + Text',
      thumbnail: 'img-7',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=240&h=180&fit=crop', tags: [{ text: "What's new", color: '#6366f1' }], title: 'Sustainable Living', body: 'Explore how sustainable furniture choices can make a positive impact on the environment without compromising on style or comfort.', readMoreLink: '#', backgroundColor: '#ffffff' },
    },
    {
      id: 'image-right-text',
      label: 'Image Right + Text',
      thumbnail: 'img-8',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=240&h=180&fit=crop', tags: [{ text: "What's new", color: '#6366f1' }], title: 'The Art of Mixing', body: 'Unlock the secrets of successful furniture mixing and learn how to effortlessly blend different styles, textures, and eras.', readMoreLink: '#', backgroundColor: '#ffffff' },
    },
    {
      id: 'image-big-button',
      label: 'Big Image + Button',
      thumbnail: 'img-9',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=560&h=300&fit=crop', tags: [{ text: 'Our new product', color: '#6366f1' }], title: 'Outdoor Oasis', body: 'Escape to your own outdoor oasis with our guide to creating a stylish and inviting outdoor space.', buttonLabel: 'Read more', buttonLink: '#', backgroundColor: '#ffffff', align: 'center' },
    },
    {
      id: 'image-big-col',
      label: 'Big Image + Columns',
      thumbnail: 'img-10',
      defaults: {
        mainImage: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=280&h=300&fit=crop',
        tags: [{ text: "What's new", color: '#6366f1' }],
        mainTitle: 'Effortless Elegance',
        mainBody: 'Discover how to effortlessly infuse elegance into your space.',
        sideArticles: [
          { date: 'September 19', title: 'Sleek Study', body: 'Minimalist design with ample workspace', link: '#', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=240&h=130&fit=crop' },
          { date: 'December 19', title: 'ErgoTech Desk', body: 'Ergonomic features for maximum comfort', link: '#', imageUrl: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=240&h=130&fit=crop' },
        ],
        backgroundColor: '#ffffff',
      },
    },
    {
      id: 'image-video',
      label: 'Video',
      thumbnail: 'img-11',
      defaults: { thumbnailUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=560&h=300&fit=crop', videoLink: '#', title: 'Outdoor Serenity', body: 'Create a tranquil outdoor retreat with our premium outdoor furniture.', backgroundColor: '#ffffff' },
    },
    {
      id: 'image-panorama',
      label: 'Wide Panorama',
      thumbnail: 'img-12',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&h=200&fit=crop', alt: 'Panorama', link: '' },
    },
  ],

  // ── CTA ───────────────────────────────────────────────────────────────────
  cta: [
    {
      id: 'cta-centered',
      label: 'Centered CTA',
      thumbnail: 'cta-1',
      defaults: { title: 'Ready to Get Started?', subtitle: 'Join thousands of happy customers today.', buttonLabel: 'Get Started', buttonLink: '#', backgroundColor: '#4F46E5', textColor: '#ffffff', buttonColor: '#ffffff', buttonTextColor: '#4F46E5' },
    },
    {
      id: 'cta-banner',
      label: 'Offer Banner',
      thumbnail: 'cta-2',
      defaults: { text: '🎉 Special Offer: 30% off your next purchase!', buttonLabel: 'Claim Now', buttonLink: '#', backgroundColor: '#fef3c7', textColor: '#92400e', buttonColor: '#d97706', buttonTextColor: '#ffffff' },
    },
    {
      id: 'cta-split',
      label: 'Text + Button Row',
      thumbnail: 'cta-3',
      defaults: { title: "Don't Miss Out", body: 'Limited time offer. Expires soon.', buttonLabel: 'Shop Now', buttonLink: '#', backgroundColor: '#1e293b', textColor: '#f1f5f9', buttonColor: '#6366f1', buttonTextColor: '#ffffff' },
    },
    {
      id: 'cta-image-bg',
      label: 'Image Background CTA',
      thumbnail: 'cta-4',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=260&fit=crop', overlayColor: 'rgba(79,70,229,0.75)', title: 'Elevate Your Space', subtitle: 'Discover the finest in modern furniture', buttonLabel: 'Explore Now', buttonLink: '#', textColor: '#ffffff' },
    },
    {
      id: 'cta-countdown',
      label: 'Countdown Offer',
      thumbnail: 'cta-5',
      defaults: { title: 'Offer Ends Soon', subtitle: 'Use code SAVE30 at checkout', timerLabel: '⏱ 2 days left', buttonLabel: 'Claim Discount', buttonLink: '#', backgroundColor: '#fdf2f8', textColor: '#9d174d', buttonColor: '#db2777', buttonTextColor: '#ffffff' },
    },
    {
      id: 'cta-referral',
      label: 'Referral CTA',
      thumbnail: 'cta-6',
      defaults: { title: 'Share & Earn', body: 'Invite a friend and both of you get $10 off your next order.', buttonLabel: 'Share Now', buttonLink: '#', backgroundColor: '#f0fdf4', textColor: '#166534', buttonColor: '#16a34a', buttonTextColor: '#ffffff' },
    },
    {
      id: 'cta-app-store',
      label: 'Download App',
      thumbnail: 'cta-7',
      defaults: { title: 'Get Our App', body: 'Shop on the go. Download our app for exclusive mobile-only deals.', appStoreLink: '#', playStoreLink: '#', backgroundColor: '#0f172a', textColor: '#f8fafc' },
    },
    {
      id: 'cta-newsletter',
      label: 'Newsletter Signup',
      thumbnail: 'cta-8',
      defaults: { title: 'Stay in the Loop', body: 'Get the latest updates delivered to your inbox weekly.', inputPlaceholder: 'Enter your email', buttonLabel: 'Subscribe', buttonLink: '#', backgroundColor: '#f5f3ff', textColor: '#4338ca' },
    },
    {
      id: 'cta-event',
      label: 'Event Invite',
      thumbnail: 'cta-9',
      defaults: { tags: [{ text: 'You\'re Invited', color: 'rgba(255,255,255,0.15)' }], title: 'Annual Design Summit 2025', date: 'Thursday, May 15, 2025 · 10:00 AM', location: 'Marina Bay Sands, Singapore', buttonLabel: 'RSVP Now', buttonLink: '#', backgroundColor: '#1e1b4b', textColor: '#e0e7ff', buttonColor: '#818cf8', buttonTextColor: '#fff' },
    },
  ],

  // ── ECOMMERCE ─────────────────────────────────────────────────────────────
  ecommerce: [
    {
      id: 'ecom-product-single',
      label: 'Single Product',
      thumbnail: 'ecom-1',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=240&fit=crop', title: 'Outdoor Sofa', price: '$299.00', originalPrice: '$399.00', description: 'Escape to your own outdoor oasis with this premium sofa.', buttonLabel: 'Shop Now', buttonLink: '#', backgroundColor: '#ffffff' },
    },
    {
      id: 'ecom-product-two',
      label: '2 Products',
      thumbnail: 'ecom-2',
      defaults: {
        products: [
          { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=260&h=200&fit=crop', title: 'Lounge Chair', price: '$149', link: '#' },
          { imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=260&h=200&fit=crop', title: 'Side Table', price: '$89', link: '#' },
        ],
        backgroundColor: '#ffffff',
      },
    },
    {
      id: 'ecom-product-three',
      label: '3 Products',
      thumbnail: 'ecom-3',
      defaults: {
        products: [
          { imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=175&h=160&fit=crop', title: 'Desk', price: '$199', link: '#' },
          { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=175&h=160&fit=crop', title: 'Sofa', price: '$299', link: '#' },
          { imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=175&h=160&fit=crop', title: 'Shelf', price: '$119', link: '#' },
        ],
        backgroundColor: '#f9fafb',
      },
    },
    {
      id: 'ecom-flash-sale',
      label: 'Flash Sale',
      thumbnail: 'ecom-4',
      defaults: { badge: '⚡ Flash Sale', title: 'Up to 50% OFF', subtitle: 'This weekend only. While stocks last.', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=560&h=220&fit=crop', buttonLabel: 'Shop the Sale', buttonLink: '#', backgroundColor: '#dc2626', textColor: '#ffffff' },
    },
    {
      id: 'ecom-featured',
      label: 'Featured Collection',
      thumbnail: 'ecom-5',
      defaults: { tags: [{ text: 'Editor\'s Pick', color: '#6366f1' }], title: 'Living Room Collection', body: 'Carefully curated pieces to transform your living space.', imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=280&h=260&fit=crop', buttonLabel: 'View Collection', buttonLink: '#', backgroundColor: '#fafaf9', align: 'right' },
    },
    {
      id: 'ecom-order-confirm',
      label: 'Order Confirmation',
      thumbnail: 'ecom-6',
      defaults: { title: 'Your Order is Confirmed! 🎉', orderNumber: '#ORD-2025-04-001', items: [{ name: 'Outdoor Sofa', qty: 1, price: '$299.00' }, { name: 'Side Table', qty: 2, price: '$178.00' }], total: '$477.00', buttonLabel: 'Track Order', buttonLink: '#', backgroundColor: '#f0fdf4' },
    },
    {
      id: 'ecom-abandoned-cart',
      label: 'Abandoned Cart',
      thumbnail: 'ecom-7',
      defaults: { title: 'You left something behind...', body: 'Complete your purchase before it sells out!', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=160&fit=crop', itemName: 'Outdoor Sofa', itemPrice: '$299.00', buttonLabel: 'Complete Purchase', buttonLink: '#', backgroundColor: '#fffbeb' },
    },
    {
      id: 'ecom-promo-code',
      label: 'Promo Code',
      thumbnail: 'ecom-8',
      defaults: { title: 'Your Exclusive Code', body: 'Use this code at checkout to get 20% off your order.', code: 'SAVE20', expiry: 'Expires April 30, 2025', buttonLabel: 'Shop Now', buttonLink: '#', backgroundColor: '#f5f3ff', accentColor: '#6366f1' },
    },
    {
      id: 'ecom-new-arrivals',
      label: 'New Arrivals',
      thumbnail: 'ecom-9',
      defaults: {
        title: 'Just Arrived',
        products: [
          { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=175&h=160&fit=crop', title: 'Neko Chair', tag: 'New', price: '$249', link: '#' },
          { imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=175&h=160&fit=crop', title: 'Alto Table', tag: 'New', price: '$179', link: '#' },
          { imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=175&h=160&fit=crop', title: 'Lume Lamp', tag: 'New', price: '$89', link: '#' },
        ],
        backgroundColor: '#ffffff',
      },
    },
    {
      id: 'ecom-review',
      label: 'Product Review',
      thumbnail: 'ecom-10',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=160&fit=crop', productName: 'Outdoor Sofa', stars: 5, reviewText: '"Absolutely love this sofa. Great quality and super comfortable!"', reviewer: 'Sarah T.', buttonLabel: 'Write a Review', buttonLink: '#', backgroundColor: '#fffbeb' },
    },
    {
      id: 'ecom-wishlist',
      label: 'Wishlist Reminder',
      thumbnail: 'ecom-11',
      defaults: { title: 'Your Wishlist is Waiting', body: 'Some items in your wishlist are almost sold out. Grab them before they\'re gone!', imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=200&h=160&fit=crop', buttonLabel: 'View Wishlist', buttonLink: '#', backgroundColor: '#fdf2f8' },
    },
    {
      id: 'ecom-referral',
      label: 'Loyalty Points',
      thumbnail: 'ecom-12',
      defaults: { title: 'You Have 500 Points!', body: 'Redeem your loyalty points for discounts on your next purchase.', points: '500 pts', equivalent: '= $10 off', buttonLabel: 'Redeem Now', buttonLink: '#', backgroundColor: '#fef3c7', accentColor: '#d97706' },
    },
    {
      id: 'ecom-bundle',
      label: 'Product Bundle',
      thumbnail: 'ecom-13',
      defaults: {
        title: 'Bundle & Save 25%',
        products: [
          { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=160&h=140&fit=crop', title: 'Sofa' },
          { imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=160&h=140&fit=crop', title: 'Table' },
        ],
        bundlePrice: '$349', originalPrice: '$468',
        buttonLabel: 'Get Bundle', buttonLink: '#',
        backgroundColor: '#f0f9ff',
      },
    },
  ],

  // ── CARDS ─────────────────────────────────────────────────────────────────
  card: [
    {
      id: 'card-product',
      label: 'Product Card',
      thumbnail: 'card-1',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop', title: 'Product Name', price: '$29.99', description: 'A short description of this amazing product.', buttonLabel: 'Buy Now', buttonLink: '#', backgroundColor: '#ffffff' },
    },
    {
      id: 'card-feature',
      label: 'Feature Icons Row',
      thumbnail: 'card-2',
      defaults: { cards: [{ icon: '⚡', title: 'Fast', body: 'Lightning fast performance.' }, { icon: '🔒', title: 'Secure', body: 'Enterprise-grade security.' }, { icon: '📱', title: 'Mobile', body: 'Works on any device.' }], backgroundColor: '#f8fafc' },
    },
    {
      id: 'card-profile',
      label: 'Profile Card',
      thumbnail: 'card-3',
      defaults: { avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face', name: 'Jane Doe', role: 'Product Manager', bio: 'Passionate about building great products.', backgroundColor: '#ffffff' },
    },
    {
      id: 'card-blog',
      label: 'Blog Card',
      thumbnail: 'card-4',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=180&fit=crop', category: 'Design', title: 'The Art of Mixing Furniture Styles', date: 'April 12, 2025', readMoreLink: '#', backgroundColor: '#ffffff' },
    },
    {
      id: 'card-testimonial',
      label: 'Testimonial',
      thumbnail: 'card-5',
      defaults: { quote: '"This is the best product I\'ve ever used. Highly recommend!"', name: 'Michael Chen', role: 'UX Designer', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face', stars: 5, backgroundColor: '#f5f3ff' },
    },
    {
      id: 'card-event',
      label: 'Event Card',
      thumbnail: 'card-6',
      defaults: { date: 'May 15', month: 'May 2025', title: 'Design Summit 2025', location: 'Marina Bay Sands, Singapore', buttonLabel: 'RSVP', buttonLink: '#', backgroundColor: '#eff6ff', accentColor: '#3b82f6' },
    },
    {
      id: 'card-stat',
      label: 'Stats / Metrics',
      thumbnail: 'card-7',
      defaults: { stats: [{ value: '98%', label: 'Satisfaction Rate' }, { value: '50K+', label: 'Happy Customers' }, { value: '4.9★', label: 'Average Rating' }], backgroundColor: '#1e1b4b', textColor: '#e0e7ff' },
    },
    {
      id: 'card-checklist-item',
      label: '1 Item Image Left',
      thumbnail: 'card-8',
      defaults: { imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=200&h=160&fit=crop', title: 'Revamp Your Space with Stylish Furniture', items: ['Timeless Charm', 'Functional Beauty', 'Endless Comfort'], buttonLabel: 'Read More', buttonLink: '#', backgroundColor: '#ffffff' },
    },
  ],

  // ── BUTTONS ───────────────────────────────────────────────────────────────
  buttons: [
    {
      id: 'button-primary',
      label: 'Primary Button',
      thumbnail: 'btn-1',
      defaults: { label: 'Click Here', link: '#', backgroundColor: '#4F46E5', textColor: '#ffffff', borderRadius: '6px', align: 'center' },
    },
    {
      id: 'button-outline',
      label: 'Outline Button',
      thumbnail: 'btn-2',
      defaults: { label: 'Learn More', link: '#', backgroundColor: 'transparent', textColor: '#4F46E5', border: '2px solid #4F46E5', borderRadius: '6px', align: 'center' },
    },
    {
      id: 'button-group',
      label: 'Button Group',
      thumbnail: 'btn-3',
      defaults: { buttons: [{ label: 'Accept', link: '#', color: '#16a34a', textColor: '#fff' }, { label: 'Decline', link: '#', color: '#dc2626', textColor: '#fff' }], align: 'center' },
    },
    {
      id: 'button-pill',
      label: 'Pill Button',
      thumbnail: 'btn-4',
      defaults: { label: 'Subscribe', link: '#', backgroundColor: '#ec4899', textColor: '#ffffff', borderRadius: '999px', align: 'center' },
    },
    {
      id: 'button-icon-left',
      label: 'Icon + Button',
      thumbnail: 'btn-5',
      defaults: { label: '→ Shop Now', link: '#', backgroundColor: '#111827', textColor: '#ffffff', borderRadius: '8px', align: 'center' },
    },
    {
      id: 'button-full-width',
      label: 'Full Width Button',
      thumbnail: 'btn-6',
      defaults: { label: 'View All Products', link: '#', backgroundColor: '#4F46E5', textColor: '#ffffff', borderRadius: '4px', align: 'center', fullWidth: true },
    },
  ],

  // ── SURVEYS ───────────────────────────────────────────────────────────────
  surveys: [
    {
      id: 'survey-rating',
      label: 'Star Rating',
      thumbnail: 'survey-1',
      defaults: { question: 'How would you rate your experience?', stars: 5, backgroundColor: '#fffbeb', buttonLabel: 'Submit', buttonLink: '#' },
    },
    {
      id: 'survey-nps',
      label: 'NPS Score',
      thumbnail: 'survey-2',
      defaults: { question: 'How likely are you to recommend us to a friend?', lowLabel: 'Not likely', highLabel: 'Very likely', buttonLabel: 'Submit', buttonLink: '#', backgroundColor: '#f0fdf4' },
    },
    {
      id: 'survey-choice',
      label: 'Multiple Choice',
      thumbnail: 'survey-3',
      defaults: { question: 'What do you enjoy most about our service?', choices: ['Speed', 'Quality', 'Support', 'Pricing'], backgroundColor: '#eff6ff', buttonLabel: 'Submit', buttonLink: '#' },
    },
    {
      id: 'survey-yesno',
      label: 'Yes / No',
      thumbnail: 'survey-4',
      defaults: { question: 'Did you find what you were looking for?', yesLink: '#', noLink: '#', backgroundColor: '#fdf4ff' },
    },
    {
      id: 'survey-csat',
      label: 'Emoji CSAT',
      thumbnail: 'survey-5',
      defaults: { question: 'How was your experience today?', emojis: ['😞', '😐', '😊', '😍'], links: ['#', '#', '#', '#'], backgroundColor: '#f0f9ff' },
    },
    {
      id: 'survey-poll',
      label: 'Quick Poll',
      thumbnail: 'survey-6',
      defaults: { question: 'Which product category interests you most?', choices: ['Furniture', 'Lighting', 'Accessories', 'Outdoor'], backgroundColor: '#f8fafc', buttonLabel: 'Vote', buttonLink: '#' },
    },
  ],

  // ── CAROUSEL ──────────────────────────────────────────────────────────────
  carousel: [
    {
      id: 'carousel-basic',
      label: 'Image Carousel',
      thumbnail: 'carousel-1',
      defaults: {
        slides: [
          { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=560&h=250&fit=crop', caption: 'Outdoor Collection' },
          { imageUrl: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=560&h=250&fit=crop', caption: 'Living Room' },
          { imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=560&h=250&fit=crop', caption: 'Modern Bedroom' },
        ],
      },
    },
    {
      id: 'carousel-product',
      label: 'Product Carousel',
      thumbnail: 'carousel-2',
      defaults: {
        slides: [
          { imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=180&h=160&fit=crop', title: 'Neko Chair', price: '$249' },
          { imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=180&h=160&fit=crop', title: 'Alto Sofa', price: '$399' },
          { imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=180&h=160&fit=crop', title: 'Lume Shelf', price: '$159' },
        ],
      },
    },
    {
      id: 'carousel-testimonial',
      label: 'Testimonial Slider',
      thumbnail: 'carousel-3',
      defaults: {
        slides: [
          { quote: '"Absolutely love the quality. Will buy again!"', name: 'Sarah T.', role: 'Interior Designer' },
          { quote: '"Fast shipping and beautifully packaged."', name: 'James R.', role: 'Architect' },
        ],
        backgroundColor: '#f5f3ff',
      },
    },
  ],

  // ── FOOTER ────────────────────────────────────────────────────────────────
  footer: [
    {
      id: 'footer-simple',
      label: 'Simple Footer',
      thumbnail: 'footer-1',
      defaults: { companyName: 'Your Company', address: '123 Main St, Singapore 123456', unsubscribeLink: '#', backgroundColor: '#f9fafb', textColor: '#6b7280' },
    },
    {
      id: 'footer-social',
      label: 'Footer + Social Links',
      thumbnail: 'footer-2',
      defaults: { companyName: 'Your Company', address: '123 Main St, Singapore 123456', socialLinks: [{ platform: 'Twitter', link: '#', icon: '🐦' }, { platform: 'LinkedIn', link: '#', icon: '💼' }, { platform: 'Instagram', link: '#', icon: '📸' }], unsubscribeLink: '#', backgroundColor: '#1e1b4b', textColor: '#c7d2fe' },
    },
    {
      id: 'footer-full',
      label: 'Full Footer',
      thumbnail: 'footer-3',
      defaults: { companyName: 'Your Company', address: '123 Main St, Singapore 123456', columns: [{ title: 'Company', links: ['About', 'Careers', 'Blog'] }, { title: 'Support', links: ['Help Center', 'Contact Us'] }], unsubscribeLink: '#', privacyLink: '#', backgroundColor: '#111827', textColor: '#9ca3af' },
    },
    {
      id: 'footer-minimal-dark',
      label: 'Minimal Dark Footer',
      thumbnail: 'footer-4',
      defaults: { companyName: 'Your Company', year: '2025', unsubscribeLink: '#', privacyLink: '#', backgroundColor: '#0f172a', textColor: '#64748b' },
    },
    {
      id: 'footer-logo-links',
      label: 'Logo + Links Footer',
      thumbnail: 'footer-5',
      defaults: { logoUrl: 'https://via.placeholder.com/120x36/4F46E5/FFFFFF?text=LOGO', links: [{ label: 'Unsubscribe', href: '#' }, { label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }], address: '123 Main St, Singapore', backgroundColor: '#f9fafb', textColor: '#6b7280' },
    },
  ],
};
