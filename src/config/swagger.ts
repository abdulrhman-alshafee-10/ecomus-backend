import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Ecomus API',
            version: '1.0.0',
            description: 'REST API for the Ecomus e-commerce platform',
        },
        servers: [
            { url: 'http://localhost:3000', description: 'Development server' },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                // ── Auth ────────────────────────────────────────────────────────
                RegisterInput: {
                    type: 'object',
                    required: ['name', 'email', 'password'],
                    properties: {
                        name: { type: 'string', example: 'Alice Smith' },
                        email: { type: 'string', format: 'email', example: 'alice@example.com' },
                        password: { type: 'string', minLength: 6, example: 'password123' },
                    },
                },
                LoginInput: {
                    type: 'object',
                    required: ['email', 'password'],
                    properties: {
                        email: { type: 'string', format: 'email', example: 'alice@example.com' },
                        password: { type: 'string', example: 'password123' },
                    },
                },
                UpdateProfileInput: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', example: 'Alice Smith' },
                        avatar: { type: 'string', example: 'https://cdn.example.com/avatar.png' },
                    },
                },
                ChangePasswordInput: {
                    type: 'object',
                    required: ['currentPassword', 'newPassword'],
                    properties: {
                        currentPassword: { type: 'string', example: 'old_password' },
                        newPassword: { type: 'string', minLength: 6, example: 'new_password' },
                    },
                },
                AuthResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean' },
                        token: { type: 'string' },
                        user: { $ref: '#/components/schemas/User' },
                    },
                },
                // ── User ────────────────────────────────────────────────────────
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string' },
                        avatar: { type: 'string' },
                        role: { type: 'string', enum: ['customer', 'admin'] },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                // ── Category ────────────────────────────────────────────────────
                Category: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string', example: 'Electronics' },
                        slug: { type: 'string', example: 'electronics' },
                        description: { type: 'string' },
                        image: { type: 'string' },
                        parent: { type: 'string', nullable: true, description: 'Parent category ID' },
                        isActive: { type: 'boolean' },
                    },
                },
                CategoryInput: {
                    type: 'object',
                    required: ['name', 'slug'],
                    properties: {
                        name: { type: 'string', example: 'Electronics' },
                        slug: { type: 'string', example: 'electronics' },
                        description: { type: 'string' },
                        image: { type: 'string' },
                        parent: { type: 'string', description: 'Parent category ObjectId' },
                        isActive: { type: 'boolean', default: true },
                    },
                },
                // ── Product ─────────────────────────────────────────────────────
                Product: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        slug: { type: 'string' },
                        description: { type: 'string' },
                        price: { type: 'number' },
                        salePrice: { type: 'number', nullable: true },
                        images: { type: 'array', items: { type: 'string' } },
                        category: { $ref: '#/components/schemas/Category' },
                        brand: { type: 'string' },
                        tags: { type: 'array', items: { type: 'string' } },
                        stock: { type: 'number' },
                        sold: { type: 'number' },
                        rating: {
                            type: 'object',
                            properties: {
                                average: { type: 'number' },
                                count: { type: 'number' },
                            },
                        },
                        isFeatured: { type: 'boolean' },
                        isActive: { type: 'boolean' },
                    },
                },
                ProductInput: {
                    type: 'object',
                    required: ['name', 'slug', 'price', 'category'],
                    properties: {
                        name: { type: 'string', example: 'Wireless Headphones' },
                        slug: { type: 'string', example: 'wireless-headphones' },
                        description: { type: 'string' },
                        price: { type: 'number', example: 99.99 },
                        salePrice: { type: 'number', example: 79.99, nullable: true },
                        images: { type: 'array', items: { type: 'string' } },
                        category: { type: 'string', description: 'Category ObjectId' },
                        brand: { type: 'string', example: 'Sony' },
                        tags: { type: 'array', items: { type: 'string' } },
                        stock: { type: 'number', example: 100 },
                        isFeatured: { type: 'boolean', default: false },
                    },
                },
                Pagination: {
                    type: 'object',
                    properties: {
                        total: { type: 'number' },
                        page: { type: 'number' },
                        pages: { type: 'number' },
                        limit: { type: 'number' },
                        hasPrev: { type: 'boolean' },
                        hasNext: { type: 'boolean' },
                        prevPage: { type: 'number', nullable: true },
                        nextPage: { type: 'number', nullable: true },
                        pageNumbers: {
                            type: 'array',
                            items: { oneOf: [{ type: 'number' }, { type: 'string', enum: ['...'] }] },
                            example: [1, 2, 3, '...', 10],
                        },
                    },
                },
                // ── Order ────────────────────────────────────────────────────────
                OrderItem: {
                    type: 'object',
                    properties: {
                        product: { type: 'string', description: 'Product ObjectId' },
                        name: { type: 'string' },
                        image: { type: 'string' },
                        price: { type: 'number' },
                        quantity: { type: 'number' },
                        variant: { type: 'string', nullable: true },
                    },
                },
                Order: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        user: { type: 'string' },
                        items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
                        shippingAddress: { type: 'object' },
                        paymentMethod: { type: 'string', enum: ['card', 'cash_on_delivery', 'paypal'] },
                        orderStatus: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
                        paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'] },
                        totalPrice: { type: 'number' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                OrderInput: {
                    type: 'object',
                    required: ['items', 'shippingAddress', 'paymentMethod', 'totalPrice'],
                    properties: {
                        items: { type: 'array', items: { $ref: '#/components/schemas/OrderItem' } },
                        shippingAddress: {
                            type: 'object',
                            required: ['fullName', 'phone', 'street', 'city', 'country'],
                            properties: {
                                fullName: { type: 'string' },
                                phone: { type: 'string' },
                                street: { type: 'string' },
                                city: { type: 'string' },
                                state: { type: 'string' },
                                country: { type: 'string' },
                                zipCode: { type: 'string' },
                            },
                        },
                        paymentMethod: { type: 'string', enum: ['card', 'cash_on_delivery', 'paypal'] },
                        totalPrice: { type: 'number' },
                    },
                },
                // ── Review ───────────────────────────────────────────────────────
                Review: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        product: { type: 'string' },
                        user: { $ref: '#/components/schemas/User' },
                        rating: { type: 'number', minimum: 1, maximum: 5 },
                        title: { type: 'string' },
                        body: { type: 'string' },
                        images: { type: 'array', items: { type: 'string' } },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                ReviewInput: {
                    type: 'object',
                    required: ['product', 'rating'],
                    properties: {
                        product: { type: 'string', description: 'Product ObjectId' },
                        rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
                        title: { type: 'string', example: 'Great product!' },
                        body: { type: 'string', example: 'I loved it.' },
                        images: { type: 'array', items: { type: 'string' } },
                    },
                },
                // ── Blog ─────────────────────────────────────────────────────────
                Blog: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        slug: { type: 'string' },
                        content: { type: 'string' },
                        excerpt: { type: 'string' },
                        coverImage: { type: 'string' },
                        author: { $ref: '#/components/schemas/User' },
                        tags: { type: 'array', items: { type: 'string' } },
                        isPublished: { type: 'boolean' },
                        views: { type: 'number' },
                        publishedAt: { type: 'string', format: 'date-time', nullable: true },
                    },
                },
                BlogInput: {
                    type: 'object',
                    required: ['title', 'slug', 'content'],
                    properties: {
                        title: { type: 'string', example: 'Top 10 Tech Gadgets' },
                        slug: { type: 'string', example: 'top-10-tech-gadgets' },
                        content: { type: 'string' },
                        excerpt: { type: 'string' },
                        coverImage: { type: 'string' },
                        tags: { type: 'array', items: { type: 'string' } },
                        isPublished: { type: 'boolean', default: false },
                    },
                },
                // ── Comment ──────────────────────────────────────────────────────
                Comment: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        blog: { type: 'string' },
                        user: { $ref: '#/components/schemas/User' },
                        body: { type: 'string' },
                        parent: { type: 'string', nullable: true, description: 'Parent comment ID for replies' },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                CommentInput: {
                    type: 'object',
                    required: ['blog', 'body'],
                    properties: {
                        blog: { type: 'string', description: 'Blog ObjectId' },
                        body: { type: 'string', example: 'Great post!' },
                        parent: { type: 'string', description: 'Parent comment ObjectId for replies', nullable: true },
                    },
                },
                // ── Common ───────────────────────────────────────────────────────
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: true },
                        message: { type: 'string' },
                    },
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        success: { type: 'boolean', example: false },
                        message: { type: 'string' },
                    },
                },
            },
        },
        paths: {
            // ── Auth ──────────────────────────────────────────────────────────────
            '/api/auth/register': {
                post: {
                    tags: ['Auth'],
                    summary: 'Register a new user',
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } } },
                    responses: {
                        201: { description: 'Registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
                        400: { description: 'Validation error' },
                    },
                },
            },
            '/api/auth/login': {
                post: {
                    tags: ['Auth'],
                    summary: 'Login and receive JWT',
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } },
                    responses: {
                        200: { description: 'JWT token', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
                        401: { description: 'Invalid credentials' },
                    },
                },
            },
            '/api/auth/me': {
                get: {
                    tags: ['Auth'],
                    summary: 'Get current user profile',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'User profile', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                        401: { description: 'Not authenticated' },
                    },
                },
                put: {
                    tags: ['Auth'],
                    summary: 'Update profile (name, avatar)',
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProfileInput' } } } },
                    responses: {
                        200: { description: 'Updated user', content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
                    },
                },
            },
            '/api/auth/change-password': {
                put: {
                    tags: ['Auth'],
                    summary: 'Change password',
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ChangePasswordInput' } } } },
                    responses: {
                        200: { description: 'Password changed', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
                    },
                },
            },
            '/api/auth/logout': {
                post: {
                    tags: ['Auth'],
                    summary: 'Logout (client should discard token)',
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: 'Logged out', content: { 'application/json': { schema: { $ref: '#/components/schemas/SuccessResponse' } } } },
                    },
                },
            },
            // ── Search ────────────────────────────────────────────────────────────
            '/api/search': {
                get: {
                    tags: ['Search'],
                    summary: 'Search across products, categories and blogs',
                    parameters: [
                        { name: 'q', in: 'query', required: true, schema: { type: 'string' }, description: 'Search term' },
                        { name: 'type', in: 'query', schema: { type: 'string', enum: ['all', 'products', 'categories', 'blogs'], default: 'all' } },
                        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                        { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
                    ],
                    responses: {
                        200: { description: 'Search results' },
                        400: { description: 'Missing query param' },
                    },
                },
            },
            // ── Categories ────────────────────────────────────────────────────────
            '/api/categories': {
                get: {
                    tags: ['Categories'],
                    summary: 'Get all active categories',
                    responses: { 200: { description: 'List of categories', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Category' } } } } } },
                },
                post: {
                    tags: ['Categories'],
                    summary: 'Create category (Admin)',
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryInput' } } } },
                    responses: {
                        201: { description: 'Created category' },
                        403: { description: 'Admin only' },
                    },
                },
            },
            '/api/categories/{id}': {
                get: {
                    tags: ['Categories'],
                    summary: 'Get single category',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Category' }, 404: { description: 'Not found' } },
                },
                put: {
                    tags: ['Categories'],
                    summary: 'Update category (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CategoryInput' } } } },
                    responses: { 200: { description: 'Updated' }, 404: { description: 'Not found' } },
                },
                delete: {
                    tags: ['Categories'],
                    summary: 'Delete category (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Deleted' }, 404: { description: 'Not found' } },
                },
            },
            // ── Products ──────────────────────────────────────────────────────────
            '/api/products': {
                get: {
                    tags: ['Products'],
                    summary: 'List products with filtering, sorting & numbered pagination',
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                        { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
                        { name: 'sort', in: 'query', schema: { type: 'string' }, description: 'e.g. -price, rating.average' },
                        { name: 'search', in: 'query', schema: { type: 'string' } },
                        { name: 'category', in: 'query', schema: { type: 'string' }, description: 'Category ObjectId' },
                        { name: 'brand', in: 'query', schema: { type: 'string' } },
                        { name: 'price[gte]', in: 'query', schema: { type: 'number' } },
                        { name: 'price[lte]', in: 'query', schema: { type: 'number' } },
                    ],
                    responses: {
                        200: {
                            description: 'Paginated product list',
                            content: {
                                'application/json': {
                                    schema: {
                                        type: 'object',
                                        properties: {
                                            success: { type: 'boolean' },
                                            count: { type: 'number' },
                                            pagination: { $ref: '#/components/schemas/Pagination' },
                                            data: { type: 'array', items: { $ref: '#/components/schemas/Product' } },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                post: {
                    tags: ['Products'],
                    summary: 'Create product (Admin)',
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } } },
                    responses: { 201: { description: 'Created product' } },
                },
            },
            '/api/products/featured': {
                get: { tags: ['Products'], summary: 'Get featured products', parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 8 } }], responses: { 200: { description: 'Featured products' } } },
            },
            '/api/products/new-arrivals': {
                get: { tags: ['Products'], summary: 'Get newest products', parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 8 } }], responses: { 200: { description: 'New arrivals' } } },
            },
            '/api/products/best-sellers': {
                get: { tags: ['Products'], summary: 'Get best selling products', parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 8 } }], responses: { 200: { description: 'Best sellers' } } },
            },
            '/api/products/wishlist': {
                get: { tags: ['Products'], summary: 'Get current user wishlist', security: [{ bearerAuth: [] }], responses: { 200: { description: 'Wishlist products' } } },
            },
            '/api/products/recently-viewed': {
                get: { tags: ['Products'], summary: 'Get recently viewed products', security: [{ bearerAuth: [] }], parameters: [{ name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } }], responses: { 200: { description: 'Recently viewed' } } },
            },
            '/api/products/slug/{slug}': {
                get: {
                    tags: ['Products'],
                    summary: 'Get product by slug',
                    parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Product' }, 404: { description: 'Not found' } },
                },
            },
            '/api/products/{id}': {
                get: {
                    tags: ['Products'],
                    summary: 'Get product by ID',
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Product', content: { 'application/json': { schema: { $ref: '#/components/schemas/Product' } } } }, 404: { description: 'Not found' } },
                },
                put: {
                    tags: ['Products'],
                    summary: 'Update product (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ProductInput' } } } },
                    responses: { 200: { description: 'Updated product' } },
                },
                delete: {
                    tags: ['Products'],
                    summary: 'Delete product (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Deleted' } },
                },
            },
            '/api/products/{id}/related': {
                get: { tags: ['Products'], summary: 'Get related products', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }, { name: 'limit', in: 'query', schema: { type: 'integer', default: 8 } }], responses: { 200: { description: 'Related products' } } },
            },
            '/api/products/{id}/wishlist': {
                put: { tags: ['Products'], summary: 'Toggle product in wishlist', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Wishlist updated' } } },
            },
            '/api/products/{id}/viewed': {
                post: { tags: ['Products'], summary: 'Track product as recently viewed', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Tracked' } } },
            },
            // ── Orders ────────────────────────────────────────────────────────────
            '/api/orders': {
                post: {
                    tags: ['Orders'],
                    summary: 'Place a new order',
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/OrderInput' } } } },
                    responses: { 201: { description: 'Order placed', content: { 'application/json': { schema: { $ref: '#/components/schemas/Order' } } } } },
                },
                get: {
                    tags: ['Orders'],
                    summary: 'Get all orders (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                        { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
                    ],
                    responses: { 200: { description: 'All orders' } },
                },
            },
            '/api/orders/my': {
                get: { tags: ['Orders'], summary: 'Get my orders', security: [{ bearerAuth: [] }], responses: { 200: { description: 'User orders' } } },
            },
            '/api/orders/{id}': {
                get: { tags: ['Orders'], summary: 'Get single order', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Order' }, 404: { description: 'Not found' } } },
            },
            '/api/orders/{id}/cancel': {
                put: { tags: ['Orders'], summary: 'Cancel order', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }], responses: { 200: { description: 'Cancelled' }, 400: { description: 'Cannot cancel' } } },
            },
            '/api/orders/{id}/status': {
                put: {
                    tags: ['Orders'],
                    summary: 'Update order status (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: {
                        required: true,
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        orderStatus: { type: 'string', enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'] },
                                        paymentStatus: { type: 'string', enum: ['pending', 'paid', 'failed', 'refunded'] },
                                    },
                                },
                            },
                        },
                    },
                    responses: { 200: { description: 'Status updated' } },
                },
            },
            // ── Reviews ───────────────────────────────────────────────────────────
            '/api/reviews': {
                get: {
                    tags: ['Reviews'],
                    summary: 'Get reviews (optionally filtered by product)',
                    parameters: [{ name: 'product', in: 'query', schema: { type: 'string' }, description: 'Product ObjectId' }],
                    responses: { 200: { description: 'List of reviews', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Review' } } } } } },
                },
                post: {
                    tags: ['Reviews'],
                    summary: 'Create a review',
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ReviewInput' } } } },
                    responses: { 201: { description: 'Review created' }, 400: { description: 'Already reviewed' } },
                },
            },
            '/api/reviews/{id}': {
                put: {
                    tags: ['Reviews'],
                    summary: 'Update review',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ReviewInput' } } } },
                    responses: { 200: { description: 'Updated' } },
                },
                delete: {
                    tags: ['Reviews'],
                    summary: 'Delete review (owner or Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Deleted' } },
                },
            },
            // ── Blogs ─────────────────────────────────────────────────────────────
            '/api/blogs': {
                get: {
                    tags: ['Blogs'],
                    summary: 'List published blogs',
                    parameters: [
                        { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                        { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
                        { name: 'search', in: 'query', schema: { type: 'string' } },
                    ],
                    responses: { 200: { description: 'Blog list' } },
                },
                post: {
                    tags: ['Blogs'],
                    summary: 'Create blog post (Admin)',
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/BlogInput' } } } },
                    responses: { 201: { description: 'Created' } },
                },
            },
            '/api/blogs/{slug}': {
                get: {
                    tags: ['Blogs'],
                    summary: 'Get blog by slug (increments view count)',
                    parameters: [{ name: 'slug', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Blog post', content: { 'application/json': { schema: { $ref: '#/components/schemas/Blog' } } } }, 404: { description: 'Not found' } },
                },
            },
            '/api/blogs/{id}': {
                put: {
                    tags: ['Blogs'],
                    summary: 'Update blog (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/BlogInput' } } } },
                    responses: { 200: { description: 'Updated' } },
                },
                delete: {
                    tags: ['Blogs'],
                    summary: 'Delete blog (Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Deleted' } },
                },
            },
            // ── Comments ──────────────────────────────────────────────────────────
            '/api/comments': {
                get: {
                    tags: ['Comments'],
                    summary: 'Get comments for a blog',
                    parameters: [{ name: 'blog', in: 'query', schema: { type: 'string' }, description: 'Blog ObjectId' }],
                    responses: { 200: { description: 'Comments' } },
                },
                post: {
                    tags: ['Comments'],
                    summary: 'Add a comment or reply',
                    security: [{ bearerAuth: [] }],
                    requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CommentInput' } } } },
                    responses: { 201: { description: 'Comment created' } },
                },
            },
            '/api/comments/{id}': {
                put: {
                    tags: ['Comments'],
                    summary: 'Edit comment',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { body: { type: 'string' } } } } } },
                    responses: { 200: { description: 'Updated' } },
                },
                delete: {
                    tags: ['Comments'],
                    summary: 'Delete comment (owner or Admin)',
                    security: [{ bearerAuth: [] }],
                    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                    responses: { 200: { description: 'Deleted' } },
                },
            },
        },
    },
    apis: [], // all definitions are inline above
};

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
