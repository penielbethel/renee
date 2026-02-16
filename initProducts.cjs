// Initialize products in the database
// Run this once: node initProducts.js

require('dotenv').config({ override: true });
const mongoose = require('mongoose');

// Product Schema
const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    tagline: { type: String },
    size: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', ProductSchema);

const initialProducts = [
    {
        id: 'kulikuli-small',
        name: 'Renee Kulikuli',
        category: 'Snacks',
        tagline: 'Traditional Groundnut Cookies',
        size: 'Small Pack',
        description: 'Crunchy, authentic groundnut cookies. Perfectly spiced for a light, healthy snack.',
        price: 500,
        image: '/images/Renee Kulikuli-S.jpg',
        rating: 4.8,
        reviews: 124
    },
    {
        id: 'kulikuli-medium',
        name: 'Renee Kulikuli',
        category: 'Snacks',
        tagline: 'Traditional Groundnut Cookies',
        size: 'Family Pack',
        description: 'Larger pack of our signature crunchy cookies, ideal for sharing with family.',
        price: 900,
        image: '/images/Renee Kulikuli-M.jpg',
        rating: 4.9,
        reviews: 86
    },
    {
        id: 'kulikuli-regular',
        name: 'Renee Kulikuli',
        category: 'Snacks',
        tagline: 'Traditional Groundnut Cookies',
        size: 'Premium Pack',
        description: 'The standard premium pack. Carefully packaged to retain that fresh, spicy crunch.',
        price: 1500,
        image: '/images/ReneeKulikuli-R.jpg',
        rating: 5.0,
        reviews: 215
    },
    {
        id: 'emi-kuli-oil',
        name: 'Renee Oils',
        category: 'Oils',
        tagline: '100% Pure Groundnut Oil',
        size: '1 Litre Bottle',
        description: 'Cholesterol-free, cold-pressed groundnut oil. Perfectly clear and heart-healthy.',
        price: 3500,
        image: '/images/Renee Oil1.jpg',
        rating: 4.9,
        reviews: 98
    },
    {
        id: 'tigernut-drink',
        name: 'Renee Tigernut',
        category: 'Drinks',
        tagline: 'Natural Energy Boost',
        size: '500ml Bottle',
        description: 'Creamy, refreshing tigernut drink. Rich in fiber and natural nutrients.',
        price: 2000,
        image: '/images/Renee Tigernut.jpg',
        rating: 4.7,
        reviews: 142
    },
    {
        id: 'rice',
        name: 'Renee Rice',
        category: 'Staples',
        tagline: 'Premium Parboiled Rice',
        size: '5kg Bag',
        description: 'Stone-free, long-grain parboiled rice. Polished and ready for your delicious meals.',
        price: 8000,
        image: '/images/renee Rice.jpg',
        rating: 5.0,
        reviews: 310
    },
    {
        id: 'honey',
        name: 'Renee Honey',
        category: 'Sweeteners',
        tagline: '100% Raw Wild Honey',
        size: '500g Bottle',
        description: 'Directly from the hive. Unadulterated raw honey with all its natural goodness.',
        price: 3000,
        image: '/images/Renee Honey.jpg',
        rating: 4.9,
        reviews: 167
    }
];

async function initProducts() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Check if products already exist
        const existingCount = await Product.countDocuments();
        if (existingCount > 0) {
            console.log(`⚠️ Database already has ${existingCount} products. Deleting old products...`);
            await Product.deleteMany({});
            console.log('✅ Old products deleted');
        }

        // Insert new products
        console.log('Inserting products...');
        await Product.insertMany(initialProducts);
        console.log(`✅ Successfully initialized ${initialProducts.length} products!`);

        // Verify
        const products = await Product.find();
        console.log('\n📦 Products in database:');
        products.forEach(p => {
            console.log(`   - ${p.name} (${p.size}): ₦${p.price.toLocaleString()}`);
        });

        console.log('\n🎉 All done! You can now use the admin dashboard to edit prices.');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

initProducts();
