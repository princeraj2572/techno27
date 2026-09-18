export const dynamic = "force-dynamic";
import { redirect } from "next/navigation";
import { getUser } from "@/actions/user-actions";
import { getRegisteredEventsAction } from "@/actions/event-actions";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/auth/login");
  if (!["INTERNAL_USER", "EXTERNAL_USER"].includes(user.role)) {
    if (user.role === "DEV_ADMIN") redirect("/dev");
    if (user.role === "MANAGEMENT_ADMIN") redirect("/admin");
    if (user.role === "EVENT_MANAGER") redirect("/event-manager");
  }

  const registeredEvents = await getRegisteredEventsAction(user.email).catch(() => []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Profile card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {user.profilePhotoUrl ? (
              <Image
                src={user.profilePhotoUrl}
                alt={user.fullName}
                width={80}
                height={80}
                className="rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground">
                {user.fullName[0]?.toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{user.fullName}</h1>
                <Badge variant={user.role === "INTERNAL_USER" ? "default" : "secondary"}>
                  {user.role === "INTERNAL_USER" ? "OPJU Student" : "External Participant"}
                </Badge>
              </div>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {user.department} • {user.program} • {user.branch} • {user.year} Year
              </p>
              {user.role === "EXTERNAL_USER" && user.participantId && (
                <div className="mt-2">
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    ID: {user.participantId}
                  </span>
                </div>
              )}
              {user.role === "INTERNAL_USER" && user.enrollmentNumber && (
                <div className="mt-2">
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    Enrollment: {user.enrollmentNumber}
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/events-selection">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl mb-1">🎯</div>
              <div className="text-sm font-medium">Browse Events</div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/team-details">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer">
            <CardContent className="pt-4 pb-4 text-center">
              <div className="text-2xl mb-1">👥</div>
              <div className="text-sm font-medium">My Teams</div>
            </CardContent>
          </Card>
        </Link>
        {user.role === "EXTERNAL_USER" && (
          <>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-4 pb-4 text-center">
                <div className="text-2xl mb-1">💳</div>
                <div className="text-sm font-medium">Payments</div>
              </CardContent>
            </Card>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="pt-4 pb-4 text-center">
                <div className="text-2xl mb-1">🏨</div>
                <div className="text-sm font-medium">Accommodation</div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Registered events */}
      <div>
        <h2 className="text-xl font-semibold mb-4">My Registered Events</h2>
        {registeredEvents.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <p>You haven&apos;t registered for any events yet.</p>
              <Link href="/events-selection" className="text-primary hover:underline mt-2 block">
                Browse events →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {registeredEvents.map((event: { _id: string; name: string; status: string; category?: string }) => (
              <Card key={event._id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base">{event.name}</CardTitle>
                    <Badge
                      variant={
                        event.status === "EVENT_LIVE"
                          ? "default"
                          : event.status === "REGISTRATION_OPEN"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {event.status.replace(/_/g, " ")}
                    </Badge>
                  </div>
                  {event.category && (
                    <p className="text-xs text-muted-foreground">{event.category}</p>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
