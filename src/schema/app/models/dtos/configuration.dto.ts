

import { Language } from './../../../common/entities/language.entity';
import { Settings } from "./settings.dto";
import { UI } from "./ui.dto";

export class Configuration {
  public language: Language = new Language();  
  public uI: UI = new UI();
  public settings: Settings = new Settings();
}