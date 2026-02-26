import { Definition } from './definition.model';

export interface Word {
  id: number;
  word: string;
  language: string;
  part_of_speech?: string;
  last_modified?: string;
  definitions: Definition[];
}
