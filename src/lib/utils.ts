/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getMergedEvents = (
  participatingTeamsData: any[],
  userEmail: string,
) => {
  const leaderTeams = participatingTeamsData.filter(
    (team: any) =>
      team.leader?.email?.toLowerCase().trim() ===
      userEmail?.toLowerCase().trim(),
  );

  const mergedMap: any = {};

  leaderTeams.forEach((team: any) => {
    const eventName = team.event.name;

    if (!mergedMap[eventName]) {
      mergedMap[eventName] = { teams: [], individualSchema: true };
    }

    mergedMap[eventName].teams.push(team);

    if (team.size !== 1) {
      mergedMap[eventName].individualSchema = false;
    }
  });

  return Object.keys(mergedMap).map((key) => ({
    eventName: key,
    ...mergedMap[key],
  }));
};

