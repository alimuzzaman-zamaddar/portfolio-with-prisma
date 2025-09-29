# Portfolio Backend API

A comprehensive backend API for a personal portfolio website built with
Express.js, TypeScript, Prisma, and PostgreSQL. This API provides
authentication, blog management, project showcase, and dashboard analytics for
portfolio owners.

## 🚀 Features

### Core Features

- **Authentication & Authorization**: JWT-based secure authentication system
- **Blog Management**: Full CRUD operations for blog posts with slug support
- **Project Showcase**: Dynamic project management with tech stack tracking
- **Dashboard Analytics**: Comprehensive statistics and analytics for portfolio
  owners
- **User Management**: Profile management and user administration

### Technical Features

- **TypeScript**: Full type safety throughout the application
- **Prisma ORM**: Type-safe database operations with PostgreSQL
- **Security**: Helmet, CORS, rate limiting, and input validation
- **Error Handling**: Comprehensive error handling and logging
- **API Documentation**: Well-structured REST API endpoints

## 📋 Requirements

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or pnpm

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd portfolio-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Environment Setup**

   ```bash
   cp env.example .env
   ```

   Update the `.env` file with your configuration:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/portfolio_db"
   JWT_SECRET="your-super-secret-jwt-key-here"
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   SEED_OWNER_EMAIL="admin@portfolio.com"
   SEED_OWNER_PASSWORD="admin123"
   SEED_OWNER_NAME="Portfolio Owner"
   ```

4. **Database Setup**

   ```bash
   # Generate Prisma client
   npm run db:generate

   # Run database migrations
   npm run db:migrate

   # Seed the database with initial data
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📚 API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register a new user
- `POST /login` - Login user
- `GET /verify` - Verify JWT token
- `GET /profile` - Get current user profile (protected)

### Blog Posts (`/api/posts`)

- `GET /` - Get all published posts (with pagination, search, filtering)
- `GET /featured` - Get featured posts
- `GET /recent` - Get recent posts
- `GET /slug/:slug` - Get post by slug
- `GET /:id` - Get post by ID
- `POST /` - Create new post (owner only)
- `PUT /:id` - Update post (owner only)
- `DELETE /:id` - Delete post (owner only)
- `GET /admin/stats` - Get blog statistics (owner only)

### Projects (`/api/projects`)

- `GET /` - Get all published projects (with pagination, search, filtering)
- `GET /featured` - Get featured projects
- `GET /slug/:slug` - Get project by slug
- `GET /:id` - Get project by ID
- `POST /` - Create new project (owner only)
- `PUT /:id` - Update project (owner only)
- `DELETE /:id` - Delete project (owner only)
- `GET /admin/stats` - Get project statistics (owner only)

### Dashboard (`/api/dashboard`)

- `GET /stats` - Get dashboard statistics (owner only)
- `GET /overview` - Get content overview (owner only)

### Users (`/api/user`)

- `GET /` - Get all users
- `GET /:id` - Get user by ID
- `POST /` - Create new user
- `PATCH /:id` - Update user
- `DELETE /:id` - Delete user

## 🗄️ Database Schema

### User Model

- Personal information (name, email, bio, location)
- Social links (website, GitHub, LinkedIn, Twitter)
- Authentication (password, role, status)
- Timestamps and verification status

### Post Model

- Content (title, slug, content, excerpt)
- Metadata (thumbnail, tags, views, featured status)
- Publishing (published status, author relationship)
- Timestamps

### Project Model

- Project details (title, slug, description, content)
- Links (live URL, GitHub URL, thumbnail)
- Technical info (tech stack, order, featured status)
- Publishing (published status, author relationship)
- Timestamps

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **CORS Configuration**: Controlled cross-origin requests
- **Helmet**: Security headers for protection
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Secure error responses without sensitive data exposure

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
PORT=5000
FRONTEND_URL="https://your-frontend-domain.com"
```

### Build and Start

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 📝 Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:migrate` - Run database migrations
- `npm run db:reset` - Reset database (WARNING: This will delete all data)
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio for database management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions, please open an issue in the
repository.

## 🔮 Future Enhancements

- [ ] Rich text editor integration
- [ ] File upload for images and documents
- [ ] Email notifications
- [ ] Comment system for blog posts
- [ ] Search functionality with Elasticsearch
- [ ] API rate limiting per user
- [ ] Backup and restore functionality
- [ ] Multi-language support
