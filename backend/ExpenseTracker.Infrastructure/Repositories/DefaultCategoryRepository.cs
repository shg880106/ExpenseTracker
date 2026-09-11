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
public class DefaultCategoryRepository : Repository<DefaultCategory>, IDefaultCategoryRepository
{
    public DefaultCategoryRepository(AppDbContext context) : base(context) { }

    public async Task<IEnumerable<DefaultCategory>> GetAllAsync()
    {
        return await _context.DefaultCategories.ToListAsync();
    }
}
