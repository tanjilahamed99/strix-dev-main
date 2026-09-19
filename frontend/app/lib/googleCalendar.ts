import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);
oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });

const calendar = google.calendar({ version: "v3", auth: oauth2Client });

interface CreateMeetingParams {
    name: string;
    email: string;
    topic: string;
    date: string;      // "2026-09-22"
    timeSlot: string;  // "10:30 AM"
    timezone: string;
}

// Parses "10:30 AM" + "2026-09-22" into a Date in the given timezone
function parseSlotToDate(date: string, timeSlot: string): Date {
    const [time, meridiem] = timeSlot.split(" ");
    let [hours, minutes] = time.split(":").map(Number);
    if (meridiem === "PM" && hours !== 12) hours += 12;
    if (meridiem === "AM" && hours === 12) hours = 0;
    const d = new Date(`${date}T00:00:00`);
    d.setHours(hours, minutes, 0, 0);
    return d;
}

export async function createConsultationMeeting(params: CreateMeetingParams) {
    const start = parseSlotToDate(params.date, params.timeSlot);
    const end = new Date(start.getTime() + 30 * 60 * 1000);

    const event = await calendar.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        sendUpdates: "all", // emails the client + adds it to their calendar automatically
        requestBody: {
            summary: `Strix Devs Consultation: ${params.topic}`,
            description: `30-minute free strategy consultation.\n\nClient: ${params.name}\nEmail: ${params.email}`,
            start: { dateTime: start.toISOString(), timeZone: params.timezone },
            end: { dateTime: end.toISOString(), timeZone: params.timezone },
            attendees: [{ email: params.email, displayName: params.name }],
            conferenceData: {
                createRequest: {
                    requestId: crypto.randomUUID(),
                    conferenceSolutionKey: { type: "hangoutsMeet" },
                },
            },
        },
    });

    const meetLink = event.data.conferenceData?.entryPoints?.find(
        (e: any) => e.entryPointType === "video"
    )?.uri;

    return {
        meetLink: meetLink || null,
        eventLink: event.data.htmlLink, // link to the event on Google Calendar
        eventId: event.data.id,
    };
}