import AddClientUseCase from "../usecase/add-client/add-client.usecase";
import FindClientUseCase from "../usecase/find-client/find-client.usecase";
import ClientAdmFacadeInterface, {
  AddClientFacadeInputDto,
  FindClientFacadeInputDto,
  FindClientFacadeOutputDto,
} from "./client-adm.facade.interface";

export interface UseCaseProps {
  addUseCase: AddClientUseCase;
  findUseCase: FindClientUseCase;
}

export default class CliendAdmFacade implements ClientAdmFacadeInterface {
  private readonly addUseCase: AddClientUseCase;
  private readonly findUseCase: FindClientUseCase;

  constructor(props: UseCaseProps) {
    this.addUseCase = props.addUseCase;
    this.findUseCase = props.findUseCase;
  }

  async add(input: AddClientFacadeInputDto): Promise<void> {
    await this.addUseCase.execute(input);
  }

  async find(
    input: FindClientFacadeInputDto
  ): Promise<FindClientFacadeOutputDto> {
    return await this.findUseCase.execute(input);
  }
}
