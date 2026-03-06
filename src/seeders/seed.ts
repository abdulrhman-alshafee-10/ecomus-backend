import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from '../models/User';
import Category from '../models/Category';
import Product from '../models/Product';
import Order from '../models/Order';
import Review from '../models/Review';
import Blog from '../models/Blog';
import Comment from '../models/Comment';

const MONGO_URI = process.env.MONGO_URI as string;

async function seed() {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ── Clear all collections ──────────────────────────────────────────────────
    await Promise.all([
        User.deleteMany({}),
        Category.deleteMany({}),
        Product.deleteMany({}),
        Order.deleteMany({}),
        Review.deleteMany({}),
        Blog.deleteMany({}),
        Comment.deleteMany({}),
    ]);
    console.log('🗑️  Cleared all collections');

    // ── Categories ─────────────────────────────────────────────────────────────
    const [men, women, kids, accessories] = await Category.insertMany([
        { name: "Men's Clothing", slug: 'mens-clothing', description: 'Clothing for men', isActive: true },
        { name: "Women's Clothing", slug: 'womens-clothing', description: 'Clothing for women', isActive: true },
        { name: "Kids' Clothing", slug: 'kids-clothing', description: 'Clothing for kids', isActive: true },
        { name: 'Accessories', slug: 'accessories', description: 'Fashion accessories', isActive: true },
    ]);

    // Sub-categories
    await Category.insertMany([
        { name: "Men's T-Shirts", slug: 'mens-tshirts', parent: men._id, isActive: true },
        { name: "Men's Pants", slug: 'mens-pants', parent: men._id, isActive: true },
        { name: "Women's Dresses", slug: 'womens-dresses', parent: women._id, isActive: true },
        { name: "Women's Tops", slug: 'womens-tops', parent: women._id, isActive: true },
        { name: 'Bags', slug: 'bags', parent: accessories._id, isActive: true },
        { name: 'Watches', slug: 'watches', parent: accessories._id, isActive: true },
    ]);
    console.log('📂 Categories seeded');

    // ── Users ──────────────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash('password123', 10);

    const [admin, alice, bob, carol] = await User.insertMany([
        {
            name: 'Admin User',
            email: 'admin@ecomus.com',
            password: hashedPassword,
            role: 'admin',
            avatar: 'https://i.pravatar.cc/150?img=1',
            isActive: true,
        },
        {
            name: 'Alice Johnson',
            email: 'alice@example.com',
            password: hashedPassword,
            role: 'customer',
            avatar: 'https://i.pravatar.cc/150?img=2',
            addresses: [
                {
                    fullName: 'Alice Johnson',
                    phone: '+1-555-0101',
                    street: '123 Main St',
                    city: 'New York',
                    state: 'NY',
                    country: 'USA',
                    zipCode: '10001',
                    isDefault: true,
                },
            ],
            isActive: true,
        },
        {
            name: 'Bob Smith',
            email: 'bob@example.com',
            password: hashedPassword,
            role: 'customer',
            avatar: 'https://i.pravatar.cc/150?img=3',
            addresses: [
                {
                    fullName: 'Bob Smith',
                    phone: '+1-555-0202',
                    street: '456 Oak Ave',
                    city: 'Los Angeles',
                    state: 'CA',
                    country: 'USA',
                    zipCode: '90001',
                    isDefault: true,
                },
            ],
            isActive: true,
        },
        {
            name: 'Carol Williams',
            email: 'carol@example.com',
            password: hashedPassword,
            role: 'customer',
            avatar: 'https://i.pravatar.cc/150?img=4',
            isActive: true,
        },
    ]);
    console.log('👤 Users seeded');

    // ── Products ───────────────────────────────────────────────────────────────
    const [p1, p2, p3, p4, p5] = await Product.insertMany([
        {
            name: 'Classic White T-Shirt',
            slug: 'classic-white-tshirt',
            description: 'A timeless white t-shirt made from 100% organic cotton.',
            price: 29.99,
            salePrice: 24.99,
            images: ['https://via.placeholder.com/600x800?text=White+Tshirt'],
            category: men._id,
            brand: 'BasicWear',
            tags: ['tshirt', 'men', 'casual'],
            variants: [
                { size: 'S', color: 'White', stock: 20, sku: 'CWT-S-W' },
                { size: 'M', color: 'White', stock: 35, sku: 'CWT-M-W' },
                { size: 'L', color: 'White', stock: 25, sku: 'CWT-L-W' },
                { size: 'XL', color: 'White', stock: 15, sku: 'CWT-XL-W' },
            ],
            stock: 95,
            isFeatured: true,
        },
        {
            name: 'Slim Fit Chino Pants',
            slug: 'slim-fit-chino-pants',
            description: 'Versatile slim fit chino pants perfect for any occasion.',
            price: 59.99,
            salePrice: null,
            images: ['https://via.placeholder.com/600x800?text=Chino+Pants'],
            category: men._id,
            brand: 'UrbanStyle',
            tags: ['pants', 'men', 'chino'],
            variants: [
                { size: '30', color: 'Beige', stock: 18, sku: 'SFC-30-B' },
                { size: '32', color: 'Beige', stock: 22, sku: 'SFC-32-B' },
                { size: '34', color: 'Navy', stock: 20, sku: 'SFC-34-N' },
            ],
            stock: 60,
            isFeatured: false,
        },
        {
            name: 'Floral Summer Dress',
            slug: 'floral-summer-dress',
            description: 'A beautiful floral print dress perfect for summer days.',
            price: 79.99,
            salePrice: 64.99,
            images: ['https://via.placeholder.com/600x800?text=Summer+Dress'],
            category: women._id,
            brand: 'BloomFashion',
            tags: ['dress', 'women', 'summer', 'floral'],
            variants: [
                { size: 'XS', color: 'Pink', stock: 12, sku: 'FSD-XS-P' },
                { size: 'S', color: 'Pink', stock: 20, sku: 'FSD-S-P' },
                { size: 'M', color: 'Blue', stock: 18, sku: 'FSD-M-BL' },
                { size: 'L', color: 'Blue', stock: 10, sku: 'FSD-L-BL' },
            ],
            stock: 60,
            isFeatured: true,
        },
        {
            name: 'Leather Crossbody Bag',
            slug: 'leather-crossbody-bag',
            description: 'Premium genuine leather crossbody bag with adjustable strap.',
            price: 149.99,
            salePrice: null,
            images: ['https://via.placeholder.com/600x800?text=Crossbody+Bag'],
            category: accessories._id,
            brand: 'LuxLeather',
            tags: ['bag', 'accessories', 'leather'],
            variants: [
                { color: 'Black', stock: 30, sku: 'LCB-BLK' },
                { color: 'Brown', stock: 25, sku: 'LCB-BRN' },
                { color: 'Tan', stock: 20, sku: 'LCB-TAN' },
            ],
            stock: 75,
            isFeatured: true,
        },
        {
            name: 'Kids Dino Hoodie',
            slug: 'kids-dino-hoodie',
            description: 'Cozy and fun dinosaur print hoodie for kids.',
            price: 39.99,
            salePrice: 32.99,
            images: ['https://via.placeholder.com/600x800?text=Dino+Hoodie'],
            category: kids._id,
            brand: 'TinyThreads',
            tags: ['kids', 'hoodie', 'dinosaur'],
            variants: [
                { size: '4T', color: 'Green', stock: 25, sku: 'KDH-4T-G' },
                { size: '6T', color: 'Green', stock: 20, sku: 'KDH-6T-G' },
                { size: '8T', color: 'Purple', stock: 15, sku: 'KDH-8T-P' },
            ],
            stock: 60,
            isFeatured: false,
        },
    ]);
    console.log('🛍️  Products seeded');

    // ── Orders ─────────────────────────────────────────────────────────────────
    await Order.insertMany([
        {
            user: alice._id,
            items: [
                { product: p1._id, name: p1.name, image: p1.images[0], price: 24.99, quantity: 2, variant: { size: 'M', color: 'White', sku: 'CWT-M-W' } },
                { product: p4._id, name: p4.name, image: p4.images[0], price: 149.99, quantity: 1, variant: { color: 'Black', sku: 'LCB-BLK' } },
            ],
            shippingAddress: { fullName: 'Alice Johnson', phone: '+1-555-0101', street: '123 Main St', city: 'New York', state: 'NY', country: 'USA', zipCode: '10001' },
            paymentMethod: 'card',
            paymentStatus: 'paid',
            orderStatus: 'delivered',
            subtotal: 199.97,
            shippingCost: 0,
            discount: 0,
            total: 199.97,
            deliveredAt: new Date(),
        },
        {
            user: bob._id,
            items: [
                { product: p3._id, name: p3.name, image: p3.images[0], price: 64.99, quantity: 1, variant: { size: 'M', color: 'Blue', sku: 'FSD-M-BL' } },
            ],
            shippingAddress: { fullName: 'Bob Smith', phone: '+1-555-0202', street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', country: 'USA', zipCode: '90001' },
            paymentMethod: 'paypal',
            paymentStatus: 'paid',
            orderStatus: 'shipped',
            subtotal: 64.99,
            shippingCost: 5.99,
            discount: 0,
            total: 70.98,
        },
        {
            user: carol._id,
            items: [
                { product: p2._id, name: p2.name, image: p2.images[0], price: 59.99, quantity: 1, variant: { size: '32', color: 'Beige', sku: 'SFC-32-B' } },
                { product: p5._id, name: p5.name, image: p5.images[0], price: 32.99, quantity: 2, variant: { size: '6T', color: 'Green', sku: 'KDH-6T-G' } },
            ],
            shippingAddress: { fullName: 'Carol Williams', phone: '+1-555-0303', street: '789 Pine Rd', city: 'Chicago', state: 'IL', country: 'USA', zipCode: '60601' },
            paymentMethod: 'cash_on_delivery',
            paymentStatus: 'pending',
            orderStatus: 'processing',
            subtotal: 125.97,
            shippingCost: 7.99,
            discount: 10,
            total: 123.96,
        },
    ]);
    console.log('📦 Orders seeded');

    // ── Reviews ────────────────────────────────────────────────────────────────
    await Review.insertMany([
        { product: p1._id, user: alice._id, rating: 5, title: 'Perfect fit!', body: 'Great quality and very comfortable. Will buy again!', isVerifiedPurchase: true },
        { product: p1._id, user: bob._id, rating: 4, title: 'Good t-shirt', body: 'Nice material, runs slightly large.', isVerifiedPurchase: false },
        { product: p3._id, user: carol._id, rating: 5, title: 'Beautiful dress', body: 'Absolutely love this dress! Perfect for summer.', isVerifiedPurchase: false },
        { product: p4._id, user: alice._id, rating: 5, title: 'Excellent quality bag', body: 'The leather is genuine and very durable. Highly recommend!', isVerifiedPurchase: true },
        { product: p5._id, user: bob._id, rating: 4, title: 'Kids love it', body: 'My son wears it every day. Very soft inside.', isVerifiedPurchase: false },
    ]);
    console.log('⭐ Reviews seeded');

    // ── Blogs ──────────────────────────────────────────────────────────────────
    const [blog1, blog2] = await Blog.insertMany([
        {
            title: 'Top 10 Summer Fashion Trends',
            slug: 'top-10-summer-fashion-trends',
            content: 'Summer is here and it\'s time to refresh your wardrobe. From floral prints to pastel colors, this season is all about vibrant styles. Lightweight fabrics like linen and cotton are must-haves, while wide-leg pants and maxi dresses continue to dominate the runways.',
            excerpt: 'Discover the hottest summer fashion trends to elevate your wardrobe this season.',
            coverImage: 'https://via.placeholder.com/1200x600?text=Summer+Trends',
            author: admin._id,
            tags: ['fashion', 'summer', 'trends'],
            isPublished: true,
            publishedAt: new Date(),
            views: 1240,
        },
        {
            title: 'How to Style a Crossbody Bag',
            slug: 'how-to-style-a-crossbody-bag',
            content: 'A crossbody bag is one of the most versatile accessories you can own. Whether you\'re heading to brunch or a night out, this style works for every occasion. Pair it with jeans and a tee for a casual look, or dress it up with a blazer for the office.',
            excerpt: 'Learn how to effortlessly style a crossbody bag for any occasion.',
            coverImage: 'https://via.placeholder.com/1200x600?text=Crossbody+Styling',
            author: admin._id,
            tags: ['accessories', 'styling', 'bags'],
            isPublished: true,
            publishedAt: new Date(),
            views: 870,
        },
    ]);
    console.log('📝 Blogs seeded');

    // ── Comments ───────────────────────────────────────────────────────────────
    const [c1] = await Comment.insertMany([
        { blog: blog1._id, user: alice._id, body: 'Love these tips! Already ordered the floral dress.', isActive: true },
        { blog: blog1._id, user: bob._id, body: 'Great article, very helpful for the upcoming season!', isActive: true },
        { blog: blog2._id, user: carol._id, body: 'I just got the leather crossbody bag — it\'s amazing!', isActive: true },
    ]);

    // Nested reply
    await Comment.create({
        blog: blog1._id,
        user: admin._id,
        body: 'Thank you Alice! Glad you found it helpful 😊',
        parent: c1._id,
        isActive: true,
    });
    console.log('💬 Comments seeded');

    console.log('\n🌱 Database seeded successfully!');
    console.log('──────────────────────────────────────');
    console.log('Admin  → admin@ecomus.com   / password123');
    console.log('User 1 → alice@example.com  / password123');
    console.log('User 2 → bob@example.com    / password123');
    console.log('User 3 → carol@example.com  / password123');
    console.log('──────────────────────────────────────');

    await mongoose.disconnect();
    process.exit(0);
}

seed().catch((err) => {
    console.error('❌ Seeder failed:', err);
    mongoose.disconnect();
    process.exit(1);
});
