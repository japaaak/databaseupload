import fs from 'fs';
import csvParse from 'csv-parse';

import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Transactions {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filepath: string): Promise<Transaction[]> {
    const createTransaction = new CreateTransactionService();

    const contactReadStream = fs.createReadStream(filepath);
    const parsers = csvParse({ ltrim: true, from_line: 2 });

    const parseCSV = contactReadStream.pipe(parsers);

    const importTransaction: Transactions[] = [];

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line;

      if (!title || !value || !type) return;

      importTransaction.push({ title, type, value, category });
    });
    await new Promise(resolve => parseCSV.on('end', resolve));

    const storedTransaction: Transaction[] = [];

    for (const transaction of importTransaction) {
      const newTransaciton = await createTransaction.execute({
        ...transaction,
      });

      storedTransaction.push(newTransaciton);
    }

    await fs.promises.unlink(filepath);

    return storedTransaction;
  }
}

export default ImportTransactionsService;
