import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const income = await transactions.reduce((acc, obj) => {
      if (obj.type === 'income') {
        return acc + obj.value;
      }
      return acc;
    }, 0);

    const outcome = await transactions.reduce((acc, obj) => {
      if (obj.type === 'outcome') {
        return acc + obj.value;
      }
      return acc;
    }, 0);

    const total = income - outcome;

    return {
      income,
      outcome,
      total,
    };
  }
}

export default TransactionsRepository;
