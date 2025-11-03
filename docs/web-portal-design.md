# React/Next.js Web Portal Design

## Overview

This document outlines the design and architecture for the React/Next.js web portal for Supervisors, Auditors, Trainers, and Managers in the Texas 811 Locate Request Management System.

**Target Users:**
- Supervisors (office-based management)
- Auditors (quality control personnel)
- Trainers (training personnel)
- Managers (executive management)

**Platform:** Web browser (Desktop and Tablet)

**Technology Stack:** Next.js 14+ with React and TypeScript

---

## Table of Contents

1. [Portal Architecture](#portal-architecture)
2. [Core Modules](#core-modules)
3. [Dashboard Design](#dashboard-design)
4. [UI/UX Design](#uiux-design)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Role-Based Access Control](#role-based-access-control)
8. [Technical Stack](#technical-stack)
9. [Deployment](#deployment)

---

## Portal Architecture

### Project Structure

```
web-portal/
??? src/
?   ??? app/                  # Next.js App Router
?   ?   ??? (auth)/           # Auth routes group
?   ?   ?   ??? login/
?   ?   ?   ??? layout.tsx
?   ?   ??? (dashboard)/      # Dashboard routes group
?   ?   ?   ??? dashboard/
?   ?   ?   ??? tickets/
?   ?   ?   ??? employees/
?   ?   ?   ??? reports/
?   ?   ?   ??? layout.tsx
?   ?   ??? api/              # API routes
?   ?   ??? layout.tsx        # Root layout
?   ??? components/           # React components
?   ?   ??? ui/               # shadcn/ui components
?   ?   ??? dashboard/        # Dashboard components
?   ?   ??? tickets/          # Ticket components
?   ?   ??? employees/        # Employee components
?   ?   ??? reports/          # Report components
?   ?   ??? maps/             # Map components
?   ??? lib/                  # Utilities
?   ?   ??? api/              # API client
?   ?   ??? auth/             # Auth utilities
?   ?   ??? utils/            # Helper functions
?   ?   ??? validations/      # Zod schemas
?   ??? hooks/                # Custom hooks
?   ??? store/                # State management (if using)
?   ??? types/                # TypeScript types
?   ??? styles/               # Global styles
??? public/                   # Static assets
??? __tests__/                # Tests
??? next.config.js            # Next.js config
```

### Architecture Pattern

- **Server Components** where possible (Next.js 14 App Router)
- **Client Components** for interactivity
- **API Routes** for server-side logic
- **Middleware** for authentication and routing

---

## Core Modules

### 1. Authentication Module

**Pages:**
- Login page
- Password reset
- Profile management

**Features:**
- JWT authentication
- Session management
- Role-based access
- Password reset flow
- Multi-factor authentication (future)

### 2. Dashboard Module

**Purpose:** Real-time overview and KPIs

**Key Components:**
- Metric cards (total tickets, active locators, risk distribution)
- Charts (ticket volume, completion rates, risk trends)
- Active ticket list
- Risk level distribution
- Weather widget
- Recent activity feed

**Dashboards by Role:**
- **Supervisor Dashboard:** Team workload, ticket assignments, status overview
- **Manager Dashboard:** Executive KPIs, predictive analytics, cost metrics
- **Auditor Dashboard:** Quality metrics, compliance tracking, incident reports

### 3. Locate Request Management

**Ticket List Page:**
- Filterable data table
- Advanced filters (status, priority, risk, date range, locator, excavator)
- Sortable columns
- Bulk actions (assign, update status)
- Export to CSV/Excel
- Real-time updates (WebSocket)

**Ticket Detail Page:**
- Full ticket information
- Risk assessment summary
- Assignment history
- Timeline/activity log
- Photos and attachments
- Manual assignment interface
- Status workflow management
- Notes and comments

**Features:**
- Create tickets manually (admin)
- Edit ticket information
- Reassign tickets
- Cancel tickets
- Merge duplicate tickets
- Export ticket data

### 4. Auto-Assignment Configuration

**Configuration Page:**
- Geo-fence management
  - Create/edit/delete geo-fences
  - Visual map interface for boundaries
  - Assign employees to geo-fences
  - Coverage area visualization
- Assignment rules
  - Experience requirements by risk level
  - Load balancing parameters
  - Priority rules
  - Override capabilities
- Assignment history
  - View auto-assignment decisions
  - Override log
  - Performance metrics

### 5. Employee Management

**Employee List Page:**
- Employee roster table
- Filters (role, status, geo-fence)
- Search by name or employee number
- Bulk operations

**Employee Detail Page:**
- Personal information
- Experience tracking (years/months)
- Damage history (12 rolling months)
- Geo-fence assignment
- Current workload
- Performance metrics
- Assignment history
- Training records (trainers only)
- Audit history

**Employee Actions:**
- Create new employee
- Update information
- Assign geo-fence
- Adjust experience level
- View damage reports
- Deactivate/reactivate

### 6. GIS File Management

**File List Page:**
- Uploaded GIS files
- Filter by utility owner, file type, date
- Version history
- File status (processing, ready, error)

**File Upload Page:**
- Drag-and-drop upload
- File validation
- Processing status
- Upload history

**File Detail Page:**
- File information
- Map preview with overlay
- Coverage area visualization
- Version history
- Download file
- Delete file (admin)

**Map Viewer:**
- Interactive map with GIS overlay
- Layer control (show/hide utilities)
- Spatial queries (find utilities in area)
- Export map as image

### 7. Weather Data Management

**Weather Dashboard:**
- Current conditions map
- Historical data charts
- Forecast view
- Weather alerts

**Data Collection:**
- Manual trigger (admin)
- Scheduled collection status
- Data source configuration

### 8. Reports & Analytics

**Executive Dashboard:**
- High-level KPIs
- Predictive analytics visualization
- Cost metrics
- Damage incident trends
- Risk score distribution
- Performance metrics by locator/team

**Damage Analysis Reports:**
- Damage incident list
- Root cause analysis
- Trend analysis
- Location heatmap
- Excavator analysis
- Locator analysis
- Cost impact analysis

**Performance Reports:**
- Ticket completion rates
- Response time metrics
- Assignment efficiency
- Locator productivity
- Quality metrics

**Predictive Analytics:**
- Risk prediction accuracy
- Model performance metrics
- Feature importance
- Trend forecasting

**Custom Report Builder:**
- Drag-and-drop report builder
- Selectable metrics
- Date range selection
- Grouping and aggregation
- Export options (PDF, Excel, CSV)

### 9. Audit & Training Module (Auditors/Trainers)

**Audit Module:**
- Audit trail viewer
- Activity logs
- Compliance tracking
- Quality assurance forms
- Incident investigation tools

**Training Module:**
- Training record management
- Course tracking
- Certification management
- Performance tracking

---

## Dashboard Design

### Supervisor Dashboard

**Layout:**
- Top row: Key metrics cards (4-6 cards)
- Middle section: Charts (ticket volume, completion rates)
- Bottom section: Active tickets table (compact view)

**Metrics:**
- Active tickets count
- High-risk tickets count
- Today's completed tickets
- Active locators count
- Average response time
- Risk level distribution

**Charts:**
- Ticket volume over time (line chart)
- Completion rate trend (line chart)
- Risk level distribution (pie chart)
- Status distribution (bar chart)

**Active Tickets Table:**
- Ticket number, address, assigned locator, status, risk level, due date
- Quick actions (view, reassign, update status)

### Manager Dashboard

**Layout:**
- Full-width metrics dashboard
- Multiple chart sections
- Predictive analytics section
- Cost metrics section

**Metrics:**
- Total tickets (month/week/day)
- Completion rate
- Average risk score
- Damage incidents (12mo)
- Cost savings estimate
- Locator efficiency

**Charts:**
- Predictive analytics (risk forecasting)
- Damage incident trends
- Cost impact analysis
- Performance metrics by team
- Risk score distribution (histogram)

**Predictive Analytics:**
- Risk prediction accuracy
- Model performance metrics
- Feature importance chart
- Trend forecasting

### Auditor Dashboard

**Layout:**
- Quality metrics
- Compliance tracking
- Incident reports
- Audit log

**Metrics:**
- Quality score
- Compliance rate
- Open incidents
- Audit completion rate

**Reports:**
- Incident investigation reports
- Quality assurance reports
- Compliance reports

---

## UI/UX Design

### Design System

**Component Library:** shadcn/ui (Tailwind CSS + Radix UI)

**Color Palette:**
- Primary: Blue (#0ea5e9)
- Success: Green (#22c55e)
- Warning: Orange (#f59e0b)
- Danger: Red (#ef4444)
- Risk Levels:
  - High: Red (#ef4444)
  - Medium: Orange (#f59e0b)
  - Low: Green (#22c55e)

**Typography:**
- Font: Inter or system font stack
- Headings: Bold (600-700)
- Body: Regular (400)

**Spacing:**
- Tailwind spacing scale (4px base unit)

### Key UI Patterns

**Data Tables:**
- TanStack Table (React Table)
- Sortable columns
- Filterable rows
- Pagination
- Row selection
- Bulk actions

**Forms:**
- React Hook Form
- Zod validation
- Real-time validation
- Error states
- Loading states

**Modals/Dialogs:**
- Radix UI Dialog
- Consistent sizing
- Focus management

**Charts:**
- Recharts or Chart.js
- Consistent styling
- Responsive design
- Interactive tooltips

**Maps:**
- Mapbox GL JS
- Custom styles
- Layer controls
- Interactive markers
- Spatial queries

### Responsive Design

- **Desktop:** Full feature set, multi-column layout
- **Tablet:** Simplified layout, collapsible sidebar
- **Mobile:** (Future) Mobile-optimized views

---

## State Management

### State Management Solution

**React Query (TanStack Query)** for server state:
- API data fetching
- Caching
- Background updates
- Optimistic updates

**Zustand** or **Context API** for UI state:
- Theme preferences
- Sidebar state
- Modal state
- Form state

### React Query Setup

```typescript
// lib/react-query.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60000, // 1 minute
      cacheTime: 300000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
```

### Custom Hooks

```typescript
// hooks/useTickets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useTickets(filters?: TicketFilters) {
  return useQuery({
    queryKey: ['tickets', filters],
    queryFn: () => apiClient.get('/locate-requests', { params: filters }),
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => apiClient.get(`/locate-requests/${id}`),
    enabled: !!id,
  });
}

export function useAssignTicket() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ ticketId, employeeId }: AssignmentRequest) =>
      apiClient.post(`/assignments`, { ticketId, employeeId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      queryClient.invalidateQueries(['employees']);
    },
  });
}
```

---

## API Integration

### API Client

```typescript
// lib/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
```

### Real-Time Updates (WebSocket)

```typescript
// hooks/useRealtimeUpdates.ts
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export function useRealtimeUpdates() {
  const queryClient = useQueryClient();
  
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'TICKET_UPDATED':
          queryClient.invalidateQueries(['tickets', data.ticketId]);
          break;
        case 'TICKET_ASSIGNED':
          queryClient.invalidateQueries(['tickets']);
          break;
        // ... other event types
      }
    };
    
    return () => ws.close();
  }, [queryClient]);
}
```

---

## Role-Based Access Control

### Role Definitions

```typescript
enum UserRole {
  SUPERVISOR = 'supervisor',
  AUDITOR = 'auditor',
  TRAINER = 'trainer',
  MANAGER = 'manager',
  ADMIN = 'admin',
}

interface RolePermissions {
  tickets: {
    view: boolean;
    create: boolean;
    edit: boolean;
    assign: boolean;
    delete: boolean;
  };
  employees: {
    view: boolean;
    create: boolean;
    edit: boolean;
    viewDamageHistory: boolean;
  };
  reports: {
    view: boolean;
    export: boolean;
    viewPredictiveAnalytics: boolean;
  };
  // ... more permissions
}
```

### Permission Checks

```typescript
// hooks/usePermissions.ts
export function usePermissions() {
  const { user } = useAuth();
  return getRolePermissions(user?.role || UserRole.SUPERVISOR);
}

// components/ProtectedComponent.tsx
export function ProtectedComponent({ requiredPermission, children }) {
  const permissions = usePermissions();
  
  if (!hasPermission(permissions, requiredPermission)) {
    return <Unauthorized />;
  }
  
  return <>{children}</>;
}
```

### Route Protection

```typescript
// middleware.ts (Next.js middleware)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token');
  const path = request.nextUrl.pathname;
  
  // Check authentication
  if (!token && !path.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Check role-based access
  // ... role checks
  
  return NextResponse.next();
}
```

---

## Technical Stack

### Core Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "zod": "^3.21.4",
    "react-hook-form": "^7.48.0",
    "@hookform/resolvers": "^3.3.0",
    "@tanstack/react-table": "^8.10.0",
    "recharts": "^2.10.0",
    "mapbox-gl": "^2.15.0",
    "react-map-gl": "^7.1.0",
    "date-fns": "^2.30.0",
    "zustand": "^4.4.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "lucide-react": "^0.292.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.2.0",
    "eslint": "^8.50.0",
    "prettier": "^3.0.0"
  }
}
```

---

## Deployment

### Build Configuration

- **Development:** `npm run dev`
- **Staging:** Vercel preview deployment
- **Production:** Vercel production deployment

### Environment Variables

```env
NEXT_PUBLIC_API_URL=https://api.locatemanagement.com/v1
NEXT_PUBLIC_WS_URL=wss://api.locatemanagement.com
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### CI/CD Pipeline

- Automated tests on PR
- Build on merge to main
- Deploy to staging
- Manual production deployment

---

## Next Steps

1. **Set Up Next.js Project** - Initialize with App Router
2. **Install Design System** - Set up shadcn/ui
3. **API Integration** - Set up React Query and API client
4. **Authentication** - Implement auth flow
5. **Dashboard** - Build main dashboard with metrics
6. **Ticket Management** - Build ticket list and detail pages
7. **Employee Management** - Build employee management module
8. **Reports** - Build reporting and analytics
9. **Testing** - Write tests for critical flows
10. **Deployment** - Deploy to staging environment

---

*Document created: 2025-01-15*
*Status: Planning & Design Phase*
*Version: 1.0*
