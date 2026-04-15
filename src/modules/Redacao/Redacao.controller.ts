import { RedacaoService } from "./Redacao.service";
import { CreateRedacaoData, UpdateRedacaoData } from "./Redacao.validator";
import { UserService } from './../User/User.service';
import { PaymentService } from "../Payment/Payment.service";
import { IPaginateParams } from "knex-paginate";

export class RedacaoController {

    private redacaoService: RedacaoService;
    private userService: UserService;
    private paymentService: PaymentService;

    constructor() {
        this.redacaoService = new RedacaoService();
        this.userService = new UserService();
        this.paymentService = new PaymentService();
    }

    async create({ users_email }: CreateRedacaoData) {
        const user = await this.userService.firstOrCreate({ email: users_email });
        return this.redacaoService.create({ users_id: user?.id })
    }

    async getById(id: string) {
        return await this.redacaoService.getById(id);
    }

    async update(id: string, data: UpdateRedacaoData) {
        return await this.redacaoService.update(id, data)
    }

    async correct(id: string, conteudo: string) {

        this.redacaoService.toCorrect(id, conteudo).catch((err) => {
            console.error(`[RedacaoController] Erro ao corrigir redação ${id}:`, err.message);
        });

        return this.paymentService.create({
            redacoes_id: id,
        });
    }

    
    async paginate(params: IPaginateParams) {
        return this.redacaoService.paginate(params);
    }
}