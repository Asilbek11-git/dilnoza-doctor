export const openApiSchema = {
  openapi: "3.0.3",
  info: {
    title: "Dilnoza Doctor - Medical Doctor Portfolio & Appointment API",
    version: "1.0.0",
    description: "Production-ready REST API for Dr. Dilnoza Yusupova's portfolio and appointment booking platform. Supports public doctor info, services, timeline, certificates, articles, FAQ, appointment booking with notifications, and secure admin endpoints.",
    contact: {
      name: "Dr. Dilnoza Yusupova",
      email: "doctor@salomat.uz"
    }
  },
  servers: [
    {
      url: "/api/v1",
      description: "Primary v1 API Server"
    }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter your JWT token obtained from /api/v1/auth/login/"
      }
    },
    schemas: {
      Doctor: {
        type: "object",
        properties: {
          id: { type: "string" },
          full_name: { type: "string" },
          specialty: { type: "string" },
          birth_year: { type: "integer" },
          experience_years: { type: "integer" },
          bio: { type: "string" },
          photo: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          address: { type: "string" },
          clinic_name: { type: "string" },
          work_hours: { type: "string" },
          is_active: { type: "boolean" }
        }
      },
      Service: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: "string" },
          short_description: { type: "string" },
          description: { type: "string" },
          icon: { type: "string" },
          duration_minutes: { type: "integer" },
          is_active: { type: "boolean" }
        }
      },
      Experience: {
        type: "object",
        properties: {
          id: { type: "string" },
          organization: { type: "string" },
          position: { type: "string" },
          start_year: { type: "integer" },
          end_year: { type: "integer", nullable: true },
          description: { type: "string" },
          is_current: { type: "boolean" }
        }
      },
      Certificate: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          organization: { type: "string" },
          year: { type: "integer" },
          image: { type: "string" },
          description: { type: "string" }
        }
      },
      Article: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          slug: { type: "string" },
          category: { type: "string" },
          excerpt: { type: "string" },
          content: { type: "string" },
          image: { type: "string" },
          author: { type: "string" },
          read_time_minutes: { type: "integer" },
          is_published: { type: "boolean" },
          published_at: { type: "string", format: "date-time" }
        }
      },
      FAQItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          question: { type: "string" },
          answer: { type: "string" },
          category: { type: "string" },
          order: { type: "integer" },
          is_active: { type: "boolean" }
        }
      },
      Appointment: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          phone: { type: "string" },
          email: { type: "string" },
          service_id: { type: "string" },
          service_title: { type: "string" },
          preferred_date: { type: "string", format: "date" },
          message: { type: "string" },
          status: { type: "string", enum: ["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"] },
          created_at: { type: "string", format: "date-time" }
        }
      },
      AppointmentCreateRequest: {
        type: "object",
        required: ["name", "phone"],
        properties: {
          name: { type: "string", example: "Ali Valiyev" },
          phone: { type: "string", example: "+998901234567" },
          email: { type: "string", example: "ali@example.com" },
          service_id: { type: "string", example: "srv-1" },
          preferred_date: { type: "string", format: "date", example: "2026-08-25" },
          message: { type: "string", example: "Bosh og'rig'i bo'yicha konsultatsiya kerak" }
        }
      }
    }
  },
  paths: {
    "/doctor/": {
      get: {
        summary: "Get Doctor Profile",
        description: "Returns public biographical and contact information about Dr. Dilnoza Yusupova.",
        responses: {
          200: { description: "Doctor information retrieved successfully" }
        }
      },
      patch: {
        summary: "Update Doctor Profile (Admin)",
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: "Doctor profile updated" }
        }
      }
    },
    "/services/": {
      get: {
        summary: "List Medical Services",
        responses: { 200: { description: "Array of medical services" } }
      },
      post: {
        summary: "Create New Service (Admin)",
        security: [{ BearerAuth: [] }],
        responses: { 201: { description: "Service created" } }
      }
    },
    "/services/{slug}/": {
      get: {
        summary: "Get Service by Slug",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Service details" }, 404: { description: "Not found" } }
      },
      patch: {
        summary: "Update Service (Admin)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Service updated" } }
      },
      delete: {
        summary: "Delete Service (Admin)",
        security: [{ BearerAuth: [] }],
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: { 204: { description: "Deleted" } }
      }
    },
    "/experiences/": {
      get: {
        summary: "List Career Milestones and Experience",
        responses: { 200: { description: "Timeline items" } }
      },
      post: {
        summary: "Add Experience (Admin)",
        security: [{ BearerAuth: [] }],
        responses: { 201: { description: "Experience record created" } }
      }
    },
    "/certificates/": {
      get: {
        summary: "List Qualifications and Certificates",
        responses: { 200: { description: "Certificates array" } }
      },
      post: {
        summary: "Add Certificate (Admin)",
        security: [{ BearerAuth: [] }],
        responses: { 201: { description: "Certificate added" } }
      }
    },
    "/articles/": {
      get: {
        summary: "List Published Articles & Blog Posts",
        parameters: [
          { name: "search", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer", default: 1 } },
          { name: "page_size", in: "query", schema: { type: "integer", default: 10 } }
        ],
        responses: { 200: { description: "Paginated list of articles" } }
      },
      post: {
        summary: "Create Article (Admin)",
        security: [{ BearerAuth: [] }],
        responses: { 201: { description: "Article created" } }
      }
    },
    "/articles/{slug}/": {
      get: {
        summary: "Get Article by Slug",
        parameters: [{ name: "slug", in: "path", required: true, schema: { type: "string" } }],
        responses: { 200: { description: "Article details" } }
      }
    },
    "/faq/": {
      get: {
        summary: "List FAQ Items",
        responses: { 200: { description: "FAQ list" } }
      },
      post: {
        summary: "Add FAQ (Admin)",
        security: [{ BearerAuth: [] }],
        responses: { 201: { description: "FAQ created" } }
      }
    },
    "/appointments/": {
      post: {
        summary: "Book an Appointment",
        description: "Public endpoint to submit an appointment request. Triggers notification and validation.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AppointmentCreateRequest" }
            }
          }
        },
        responses: {
          201: { description: "Appointment submitted successfully" },
          400: { description: "Validation error" }
        }
      },
      get: {
        summary: "List All Appointments (Admin)",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "search", in: "query", schema: { type: "string" } }
        ],
        responses: { 200: { description: "List of appointments" } }
      }
    },
    "/auth/login/": {
      post: {
        summary: "Admin Login & JWT Token Generation",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "admin" },
                  password: { type: "string", example: "adminpassword123" }
                }
              }
            }
          }
        },
        responses: {
          200: { description: "JWT Access and Refresh tokens" },
          401: { description: "Invalid credentials" }
        }
      }
    }
  }
};
