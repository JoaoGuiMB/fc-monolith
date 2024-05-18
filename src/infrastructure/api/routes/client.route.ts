import express, { Request, Response } from "express";
import clientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import { AddClientInputDto } from "../../../modules/client-adm/usecase/add-client/add-client.usecase.dto";

export const clientRoute = express.Router();

const clientAdmFacadeFactoryInstance = clientAdmFacadeFactory.create();
clientRoute.post("/", async (req: Request, res: Response) => {
  try {
    const clientDto: AddClientInputDto = {
      name: req.body.name,
      address: req.body.address,
      email: req.body.email,
    };
    const client = await clientAdmFacadeFactoryInstance.add(clientDto);
    res.status(200).json(client);
  } catch (error) {
    res.status(500).send(error);
  }
});
