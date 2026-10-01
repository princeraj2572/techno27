// O.P. Jindal University (Raigarh) academic structure, used to populate
// department/branch dropdowns on signup and the admin participant filters.
// Source: opju.ac.in and third-party admission listings (careers360,
// collegedekho) as of 2026 — update here if the university's offerings change.

export const OPJU_DEPARTMENTS = [
  "School of Engineering and Technology",
  "School of Management",
  "School of Science",
  "School of Law",
  "School of Architecture",
  "School of Liberal Arts",
] as const;

export const OPJU_BRANCHES = [
  "Computer Science and Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Metallurgical and Materials Engineering",
  "Mining Engineering",
  "Management Studies",
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biotechnology",
  "Humanities",
  "Law",
  "Architecture",
] as const;

export const OPJU_SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

// Sentinel value for "Other" — a branch not in OPJU_BRANCHES (user typed
// their own at signup). Used both in dropdown values and as the signal
// to build a $nin query instead of an exact match.
export const OTHER_BRANCH_VALUE = "__other_branch";

// Shared Mongo filter builder: exact match for a known branch, or
// "anything not in the official list (and not empty)" for Other.
export function branchFilterValue(branch: string): unknown {
  if (branch === OTHER_BRANCH_VALUE) {
    return { $nin: [...OPJU_BRANCHES, null, ""] };
  }
  return branch;
}
