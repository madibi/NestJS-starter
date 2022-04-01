import { AppDirection } from './../enums/app-direction.enum';
import { AppTheme } from './../enums/app-theme.enum';
import { Theme } from './theme.dto';

export class UI { 
  public theme: Theme = new Theme();
  public appDirection: AppDirection = AppDirection.LTR;
  public appTheme: AppTheme = AppTheme.DARK;
}