import { getCustomRepository } from 'typeorm';

import AppError from '../errors/AppError';
import TransactionRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionRepository);

    const findID = await transactionRepository.findOne({ id });
    if (!findID) {
      throw new AppError('This Transaction doesnt exist');
    }
    await transactionRepository.delete(id);
  }
}

export default DeleteTransactionService;
