using ExpenseTracker.Core.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpenseTracker.Core.Interfaces;
public interface ITransactionRepository : IRepository<Transaction>
{
    Task<IEnumerable<Transaction>> GetByUserIdAsync(
        int userId,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        int? categoryId = null,
        TransactionType? type = null);

    new Task<Transaction?> GetByIdAsync(int id);
}
