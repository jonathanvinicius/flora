export interface IUseCase<InputType, OutputType> {
  execute(context: InputType): OutputType | Promise<OutputType>;
}
export interface IUsecase {
  execute(...context: any): any;
}
