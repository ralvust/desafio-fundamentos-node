import Transaction from '../models/Transaction';

interface CreateTransaction {
  title: string;

  value: number;

  type: 'income' | 'outcome';
}

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const totalIncome = this.transactions.reduce((total, actual) => {
      if (actual.type === 'income') {
        return total + actual.value;
      }
      return total;
    }, 0);

    const totalOutcome = this.transactions.reduce((total, actual) => {
      if (actual.type === 'outcome') {
        return total + actual.value;
      }
      return total;
    }, 0);

    const totalBalance = totalIncome - totalOutcome;

    return {
      income: totalIncome,
      outcome: totalOutcome,
      total: totalBalance,
    };
  }

  public create({ title, type, value }: CreateTransaction): Transaction {
    const balance = this.getBalance();

    const transaction = new Transaction({ title, type, value });

    switch (transaction.type) {
      case 'income':
        this.transactions.push(transaction);
        break;
      case 'outcome':
        if (balance.total >= value) {
          this.transactions.push(transaction);
        } else {
          throw new Error('No sufficient amount for the transaction.');
        }
        break;
      default:
        throw new Error(
          'Please choose between Outcome or Income for the transaction.',
        );
    }

    return transaction;
  }
}

export default TransactionsRepository;
