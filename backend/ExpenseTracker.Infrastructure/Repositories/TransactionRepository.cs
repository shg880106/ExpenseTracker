using ExpenseTracker.Core.Entities;
using ExpenseTracker.Core.Interfaces;
using ExpenseTracker.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpenseTracker.Infrastructure.Repositories;
public class TransactionRepository : Repository<Transaction>, ITransactionRepository
{
    public TransactionRepository(AppDbContext context) : base(context) { }

    public async Task<Transaction?> GetByIdAsync(int id) =>
        await _dbSet
            .Include(t => t.Category)
            .FirstOrDefaultAsync(t => t.Id == id);

    public async Task<IEnumerable<Transaction>> GetByUserIdAsync(
        int userId,
        DateTime? fromDate = null,
        DateTime? toDate = null,
        int? categoryId = null,
        TransactionType? type = null)
    {
        var query = _dbSet
            .Include(t => t.Category)
            .Where(t => t.UserId == userId);

        if (fromDate.HasValue)
            query = query.Where(t => t.Date >= fromDate.Value);

        if (toDate.HasValue)
            query = query.Where(t => t.Date <= toDate.Value);

        if (categoryId.HasValue)
            query = query.Where(t => t.CategoryId == categoryId.Value);

        if (type.HasValue)
            query = query.Where(t => t.Type == type.Value);

        return await query.OrderByDescending(t => t.Date).ToListAsync();
    }
}
