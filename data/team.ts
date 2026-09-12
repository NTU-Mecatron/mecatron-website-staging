import { parse } from 'yaml';
import source from './team.yaml?raw';

export interface TeamData {
  name: string;
  descriptor: string;
  location: string;
  copyright: string;
  contact: { label: string; email: string };
  navigation: Array<{ label: string; href: string }>;
  members: Array<{ name: string; role: string; bio: string }>;
}

const site = parse(source) as TeamData;

export default site;
