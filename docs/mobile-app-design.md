# React Native iOS Mobile App Design

## Overview

This document outlines the design and architecture for the React Native iOS mobile application for Utility Locators and Field Supervisors in the Texas 811 Locate Request Management System.

**Target Users:**
- Utility Locators (field technicians)
- Field Supervisors (field management)

**Platform:** iOS (iPhone/iPad)

**Technology Stack:** React Native with TypeScript

---

## Table of Contents

1. [App Architecture](#app-architecture)
2. [Core Features](#core-features)
3. [Screen Flow & Navigation](#screen-flow--navigation)
4. [UI/UX Design](#uiux-design)
5. [State Management](#state-management)
6. [API Integration](#api-integration)
7. [Offline Support](#offline-support)
8. [Push Notifications](#push-notifications)
9. [Map Integration](#map-integration)
10. [Technical Stack](#technical-stack)

---

## App Architecture

### Component Structure

```
App/
??? src/
?   ??? components/          # Reusable UI components
?   ?   ??? common/         # Buttons, Cards, Inputs
?   ?   ??? locate/         # Locate-specific components
?   ?   ??? map/            # Map components
?   ??? screens/            # Screen components
?   ?   ??? auth/           # Login, Onboarding
?   ?   ??? dashboard/      # Home/Dashboard
?   ?   ??? tickets/        # Ticket list and details
?   ?   ??? map/            # Map view
?   ?   ??? profile/        # User profile
?   ?   ??? settings/       # App settings
?   ??? navigation/         # Navigation configuration
?   ??? store/              # Redux/Zustand store
?   ??? services/           # API services
?   ??? utils/              # Helper functions
?   ??? hooks/              # Custom React hooks
?   ??? types/              # TypeScript types
?   ??? constants/          # App constants
??? assets/                 # Images, fonts, icons
??? __tests__/              # Tests
??? app.json                # Expo config (if using)
```

### Architecture Pattern

- **MVVM (Model-View-ViewModel)** or **Component-Based Architecture**
- **Container/Presenter Pattern** for separation of concerns
- **Service Layer** for API calls and business logic

---

## Core Features

### 1. Authentication & Onboarding

**Screens:**
- Login screen (email/password)
- Biometric authentication (Face ID / Touch ID)
- Onboarding flow (first-time users)

**Features:**
- JWT token management
- Refresh token rotation
- Secure credential storage (iOS Keychain)
- Remember me functionality
- Password reset flow

### 2. Dashboard / Home

**Purpose:** Quick overview of assigned tickets and status

**Key Components:**
- Ticket count cards (Pending, In Progress, Completed)
- Today's schedule
- Active tickets list (priority sorted)
- Quick actions (Accept Ticket, View Map)
- Weather widget (current conditions)
- Risk level summary

**Data Displayed:**
- Total assigned tickets
- High-priority tickets count
- Next ticket due time
- Today's completed tickets
- Current risk level distribution

### 3. Ticket Management

**Ticket List Screen:**
- Filterable list of assigned tickets
- Filters: Status, Priority, Risk Level, Date
- Sort options: Due Date, Priority, Distance
- Search by ticket number or address
- Pull-to-refresh
- Infinite scroll for large lists

**Ticket Detail Screen:**
- Ticket number and status
- Full address and map preview
- Coordinates and boundary box
- Work details (type, depth, length)
- Utilities present
- Risk assessment summary
- Distance calculation
- Damage history (site and excavator)
- Weather conditions
- Assignment recommendation
- **Actions:**
  - Accept/Reject ticket
  - Start work
  - Update status
  - Add photos
  - Add notes
  - Mark complete
  - Report issue

**Ticket Card Components:**
- Ticket number badge
- Address (truncated)
- Distance from current location
- Risk level indicator (color-coded)
- Utilities icons
- Status badge
- Due date/time
- Priority indicator

### 4. Map View

**Purpose:** Visual representation of tickets on map

**Features:**
- Map view with ticket markers
- Cluster markers for nearby tickets
- Filter by status/priority/risk
- GPS tracking (optional)
- Current location indicator
- Route planning to ticket location
- GIS overlay (if available)
- Utility lines overlay (from GIS files)
- Soil type overlay (if available)
- Distance calculations
- Boundary box visualization

**Map Marker Types:**
- High-risk tickets (red)
- Medium-risk tickets (yellow)
- Low-risk tickets (green)
- Completed tickets (gray)
- Current location (blue)

### 5. Field Marking (Future Enhancement)

**Features:**
- Mark utilities in field
- Draw utility lines on map
- Attach photos to marks
- GPS coordinates for each mark
- Color coding by utility type
- Standard marking colors (APWA)
- Submit marks to system

### 6. Photo Capture

**Features:**
- Camera integration
- Photo gallery selection
- Image compression
- GPS location tagging
- Timestamp
- Photo descriptions
- Attach to tickets
- Upload to server

### 7. Offline Support

**Cached Data:**
- Assigned tickets (last sync)
- Ticket details
- Maps (downloaded regions)
- User profile

**Offline Actions:**
- View cached tickets
- Take photos (queued for upload)
- Add notes (queued for upload)
- Update status (queued for sync)
- View map (cached tiles)

**Sync Behavior:**
- Auto-sync when online
- Manual sync option
- Conflict resolution

### 8. Push Notifications

**Notification Types:**
- New ticket assignment
- Ticket status updates
- Emergency tickets
- High-priority ticket alerts
- System announcements
- Weather alerts

**Notification Actions:**
- View ticket
- Accept ticket
- Navigate to location
- Snooze (5 min, 15 min, 1 hour)

### 9. Profile & Settings

**Profile Screen:**
- Employee information
- Experience level
- Current workload
- Damage history (12 months)
- Geo-fence assignment
- Performance metrics

**Settings Screen:**
- Notification preferences
- Map settings (default zoom, layers)
- Offline cache management
- App version info
- Logout
- Account deletion

### 10. Reports & Analytics (Field Supervisors)

**Additional features for supervisors:**
- Team workload view
- Ticket assignment override
- Performance metrics
- Damage incident reports
- Team analytics

---

## Screen Flow & Navigation

### Navigation Structure

```
App (Root Navigator)
?
??? Auth Stack
?   ??? Login
?   ??? Onboarding
?   ??? Password Reset
?
??? Main Stack (after authentication)
    ??? Dashboard (Home)
    ??? Tickets Stack
    ?   ??? Ticket List
    ?   ??? Ticket Detail
    ??? Map View
    ??? Profile
    ??? Settings
```

### Navigation Pattern

**Bottom Tab Navigator** (Main screens):
- Dashboard
- Tickets
- Map
- Profile

**Stack Navigator** (Nested navigation):
- Tickets List ? Ticket Detail
- Map ? Ticket Detail
- Profile ? Settings

### Deep Linking

Support deep links for:
- Direct ticket navigation: `locateapp://ticket/TX811-2025-001234`
- Map view with filter: `locateapp://map?status=assigned`
- Notification navigation

---

## UI/UX Design

### Design System

**Color Palette:**
- Primary: Blue (#007AFF - iOS standard)
- Success: Green (#34C759)
- Warning: Orange (#FF9500)
- Danger: Red (#FF3B30)
- Risk Levels:
  - High: Red (#FF3B30)
  - Medium: Orange (#FF9500)
  - Low: Green (#34C759)

**Typography:**
- Primary Font: San Francisco (iOS system font)
- Headings: SF Pro Display (Bold)
- Body: SF Pro Text (Regular)
- Monospace: SF Mono (for ticket numbers)

**Spacing:**
- Base unit: 8px
- Consistent spacing scale (8, 16, 24, 32, 48)

**Components:**
- iOS-native appearance where possible
- Custom components styled to match iOS design language
- Material Design Bottom Sheet for actions

### Key UI Patterns

**Card-Based Design:**
- Ticket cards with shadows and rounded corners
- Clear hierarchy and information density

**Pull-to-Refresh:**
- Native iOS pull-to-refresh pattern
- Haptic feedback

**Bottom Sheet Actions:**
- Action sheet for ticket actions
- Destructive actions (red) clearly indicated

**Empty States:**
- Friendly empty state illustrations
- Helpful guidance text

**Loading States:**
- Skeleton screens for content loading
- Progress indicators for uploads

**Error States:**
- Clear error messages
- Retry actions
- Offline indicators

---

## State Management

### State Management Solution

**Option 1: Redux Toolkit** (Recommended for complex state)
- Centralized state management
- Time-travel debugging
- Middleware for async operations

**Option 2: Zustand** (Lightweight alternative)
- Simpler API
- Less boilerplate
- Good for smaller apps

**Option 3: React Query + Context** (Modern approach)
- React Query for server state
- Context API for UI state
- Automatic caching and sync

**Recommendation:** React Query + Context for MVP, migrate to Redux Toolkit if state complexity grows.

### State Structure

```typescript
// App State
interface AppState {
  auth: AuthState;
  tickets: TicketsState;
  map: MapState;
  profile: ProfileState;
  offline: OfflineState;
}

// Auth State
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  biometricEnabled: boolean;
}

// Tickets State
interface TicketsState {
  assigned: Ticket[];
  inProgress: Ticket[];
  completed: Ticket[];
  selectedTicket: Ticket | null;
  filters: TicketFilters;
  loading: boolean;
  error: string | null;
}

// Map State
interface MapState {
  center: Coordinates;
  zoom: number;
  markers: MapMarker[];
  visibleTickets: Ticket[];
  selectedMarker: MapMarker | null;
  layers: MapLayer[];
}
```

---

## API Integration

### API Client Setup

```typescript
// services/api.ts
import axios from 'axios';
import { store } from '../store';

const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://api.locatemanagement.com/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (add auth token)
apiClient.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (handle errors, token refresh)
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Attempt token refresh
      // Navigate to login on failure
    }
    return Promise.reject(error);
  }
);
```

### React Query Integration

```typescript
// hooks/useTickets.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export function useAssignedTickets(filters?: TicketFilters) {
  return useQuery({
    queryKey: ['tickets', 'assigned', filters],
    queryFn: () => apiClient.get('/locate-requests', { params: filters }),
    staleTime: 30000, // 30 seconds
    cacheTime: 300000, // 5 minutes
  });
}

export function useTicket(id: string) {
  return useQuery({
    queryKey: ['tickets', id],
    queryFn: () => apiClient.get(`/locate-requests/${id}`),
    enabled: !!id,
  });
}

export function useUpdateTicketStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiClient.patch(`/locate-requests/${id}/status`, { status }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries(['tickets', id]);
      queryClient.invalidateQueries(['tickets', 'assigned']);
    },
  });
}
```

---

## Offline Support

### Offline Strategy

**Data Caching:**
- React Query cache for server data
- AsyncStorage for persistent cache
- Map tiles cached locally

**Queue System:**
- Queue actions when offline
- Sync queue when online
- Conflict resolution strategy

**Implementation:**

```typescript
// utils/offlineQueue.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

export class OfflineQueue {
  private static QUEUE_KEY = '@offline_queue';
  
  static async add(action: QueuedAction) {
    const queue = await this.getQueue();
    queue.push({
      ...action,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    });
    await AsyncStorage.setItem(this.QUEUE_KEY, JSON.stringify(queue));
  }
  
  static async getQueue(): Promise<QueuedAction[]> {
    const data = await AsyncStorage.getItem(this.QUEUE_KEY);
    return data ? JSON.parse(data) : [];
  }
  
  static async processQueue() {
    const queue = await this.getQueue();
    // Process each queued action
    // Remove successful actions
    // Keep failed actions for retry
  }
}

// Usage in components
import NetInfo from '@react-native-community/netinfo';

const isOnline = useNetInfo().isConnected;

const handleUpdateStatus = async (status: string) => {
  if (isOnline) {
    await updateTicketStatus({ id, status });
  } else {
    await OfflineQueue.add({
      type: 'UPDATE_TICKET_STATUS',
      payload: { id, status },
    });
  }
};
```

---

## Push Notifications

### Push Notification Setup

**Dependencies:**
- `@react-native-firebase/messaging` or `expo-notifications`
- Firebase Cloud Messaging (FCM) for iOS

**Implementation:**

```typescript
// services/notifications.ts
import messaging from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';

export async function requestNotificationPermission() {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
  }
  return true;
}

export async function getFCMToken() {
  const token = await messaging().getToken();
  // Send token to backend
  await apiClient.post('/notifications/register', { token });
  return token;
}

// Handle foreground notifications
messaging().onMessage(async (remoteMessage) => {
  // Show local notification
  // Update app state
});

// Handle background/quit notifications
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  // Handle notification data
});
```

### Notification Types

```typescript
interface NotificationPayload {
  type: 'ticket_assigned' | 'ticket_updated' | 'emergency' | 'system';
  ticketId?: string;
  title: string;
  body: string;
  data?: {
    ticketId: string;
    action: string;
  };
}
```

---

## Map Integration

### Map Library

**Option 1: React Native Maps** (Free, good for basic needs)
- Native iOS/Android maps
- Custom markers and overlays
- Routing support

**Option 2: Mapbox** (Recommended for advanced features)
- Custom map styles
- Better performance
- Advanced features (clustering, heatmaps)
- Offline map downloads

**Recommendation:** Start with React Native Maps for MVP, migrate to Mapbox if advanced features needed.

### Map Features

```typescript
// components/MapView.tsx
import MapView, { Marker, Polygon, Polyline } from 'react-native-maps';

interface TicketMapViewProps {
  tickets: Ticket[];
  selectedTicket?: Ticket;
  onMarkerPress: (ticket: Ticket) => void;
}

export function TicketMapView({ tickets, selectedTicket, onMarkerPress }: TicketMapViewProps) {
  return (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: 29.4241,
        longitude: -98.4936,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }}
      showsUserLocation
      showsMyLocationButton
    >
      {tickets.map((ticket) => (
        <Marker
          key={ticket.id}
          coordinate={ticket.coordinates}
          pinColor={getRiskColor(ticket.riskLevel)}
          onPress={() => onMarkerPress(ticket)}
        />
      ))}
      
      {selectedTicket?.boundaryBox && (
        <Polygon
          coordinates={selectedTicket.boundaryBox}
          strokeColor="#FF0000"
          fillColor="rgba(255,0,0,0.2)"
        />
      )}
    </MapView>
  );
}
```

### GIS Overlay Integration

```typescript
// Load GIS data for utilities overlay
async function loadUtilityOverlay(boundaryBox: Polygon) {
  const gisData = await apiClient.post('/gis-files/query', {
    boundary: boundaryBox,
    utilityTypes: ['gas', 'electric', 'water'],
  });
  
  // Render utility lines on map
  return gisData.features.map((feature) => ({
    type: 'Feature',
    properties: feature.properties,
    geometry: feature.geometry,
  }));
}
```

---

## Technical Stack

### Core Dependencies

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-native": "^0.72.0",
    "@react-navigation/native": "^6.1.0",
    "@react-navigation/stack": "^6.3.0",
    "@react-navigation/bottom-tabs": "^6.5.0",
    "@tanstack/react-query": "^5.0.0",
    "axios": "^1.6.0",
    "react-native-maps": "^1.7.0",
    "@react-native-community/netinfo": "^11.0.0",
    "@react-native-async-storage/async-storage": "^1.19.0",
    "@react-native-firebase/messaging": "^18.0.0",
    "react-native-image-picker": "^5.6.0",
    "react-native-geolocation-service": "^5.3.0",
    "react-native-safe-area-context": "^4.7.0",
    "zod": "^3.21.4",
    "date-fns": "^2.30.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-native": "^0.72.0",
    "typescript": "^5.2.0",
    "@testing-library/react-native": "^12.1.0",
    "jest": "^29.7.0"
  }
}
```

### Project Setup

**Development Tools:**
- Expo (optional, for faster development)
- React Native CLI
- Xcode (iOS development)
- CocoaPods (iOS dependencies)

**Code Quality:**
- ESLint
- Prettier
- TypeScript strict mode
- Pre-commit hooks (Husky)

---

## Testing Strategy

### Unit Tests

- Test utility functions
- Test business logic
- Test data transformations

### Component Tests

- Test UI components
- Test user interactions
- Test state management

### Integration Tests

- Test API integration
- Test navigation flow
- Test offline functionality

### E2E Tests

- Test critical user flows
- Test ticket assignment flow
- Test map interactions

**Testing Framework:**
- Jest (unit/integration)
- React Native Testing Library (components)
- Detox (E2E, optional)

---

## Deployment

### Build Configuration

- **Development:** Expo Go or development build
- **Staging:** TestFlight beta testing
- **Production:** App Store release

### CI/CD Pipeline

- Automated tests on PR
- Build iOS app on merge
- Distribute via TestFlight
- Release to App Store

---

## Next Steps

1. **Set Up Project Structure** - Initialize React Native project
2. **Design System** - Create component library
3. **API Integration** - Set up API client and React Query
4. **Navigation Setup** - Configure navigation stack
5. **Core Screens** - Build authentication and dashboard
6. **Ticket Management** - Implement ticket list and detail screens
7. **Map Integration** - Add map view with markers
8. **Offline Support** - Implement offline queue
9. **Push Notifications** - Set up FCM
10. **Testing** - Write tests for critical flows

---

*Document created: 2025-01-15*
*Status: Planning & Design Phase*
*Version: 1.0*
