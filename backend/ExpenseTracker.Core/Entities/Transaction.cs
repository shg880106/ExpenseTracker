using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ExpenseTracker.Core.Entities;
public class Transaction
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public DateTime Date { get; set; }
    public string? Description { get; set; }
    public TransactionType Type { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
