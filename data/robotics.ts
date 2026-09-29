import { parse } from 'yaml';
import { parse as parseCsv } from 'csv-parse/sync';
import vehiclesSource from './vehicles.yaml?raw';
import competitionsSource from './competitions.yaml?raw';
import teamsSource from './teams.yaml?raw';
import membersSource from './members.csv?raw';
import memberYearsSource from './members-by-year.yaml?raw';

export interface Vehicle {
  slug: string;
  name: string;
  year: number;
  description: string;
  tags: string[];
  status: string;
}

export interface Competition {
  name: string;
  series: string;
  year: number;
}

export interface TeamGroup {
  name: string;
  slug: string;
}

export interface Member {
  id: string;
  name: string;
  degree: string;
  detail: string;
  image: string;
  hoverImage: string;
  profileUrl: string;
}

export interface YearMember {
  id: string;
  role: string;
  type?: 'lead' | 'colead' | 'advisor' | 'member';
}

export interface YearDivision {
  slug: string;
  members: YearMember[];
}

interface MemberYearData {
  latestYear: number;
  years: Record<string, { divisions: YearDivision[] }>;
}

const memberProfiles = parseCsv(membersSource, { columns: true, skip_empty_lines: true }) as Member[];
const memberYearData = parse(memberYearsSource) as MemberYearData;

export const robotics = {
  vehicles: parse(vehiclesSource) as Vehicle[],
  competitions: parse(competitionsSource) as Competition[],
  teams: parse(teamsSource) as TeamGroup[],
  members: memberProfiles,
  memberYears: memberYearData
};
