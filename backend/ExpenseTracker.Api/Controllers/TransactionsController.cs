using ExpenseTracker.Core.DTOs;
using ExpenseTracker.Core.Entities;
using ExpenseTracker.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace ExpenseTracker.Api.Controllers;
[Authorize]
[ApiController]
[Route("api/[controller]")]
public class TransactionsController : ControllerBase
{
    private readonly ITransactionRepository _transactionRepository;
    private readonly ICategoryRepository _categoryRepository;

    public TransactionsController(
        ITransactionRepository transactionRepository,
        ICategoryRepository categoryRepository)
    {
        _transactionRepository = transactionRepository;
        _categoryRepository = categoryRepository;
    }

    private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TransactionDto>>> GetAll([FromQuery] DateTime? fromDate,
                            [FromQuery] DateTime? toDate,
                            [FromQuery] int? categoryId,
                            [FromQuery] TransactionType? type)
    {
        var transactions = await _transactionRepository.GetByUserIdAsync(CurrentUserId, fromDate, toDate, 
                            categoryId, type);

        var dtos = transactions.Select(t => new TransactionDto
        {
            Id = t.Id,
            Amount = t.Amount,
            Date = t.Date,
            Description = t.Description,
            Type = t.Type,
            CategoryId = t.CategoryId,
            CategoryName = t.Category.Name
        });

        return Ok(dtos);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TransactionDto>> GetById(int id)
    {
        var transaction = await _transactionRepository.GetByIdAsync(id);
        if (transaction == null || transaction.UserId != CurrentUserId) return NotFound();

        return Ok(new TransactionDto
        {
            Id = transaction.Id,
            Amount = transaction.Amount,
            Date = transaction.Date,
            Description = transaction.Description,
            Type = transaction.Type,
            CategoryId = transaction.CategoryId,
            CategoryName = transaction.Category.Name
        });
    }

    [HttpPost]
    public async Task<ActionResult<TransactionDto>> Create(CreateTransactionDto dto)
    {
        // Validate that the category exists and belongs to the user
        var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
        if (category == null || category.UserId != CurrentUserId)
            return BadRequest("Invalid category.");

        var transaction = new Transaction
        {
            Amount = dto.Amount,
            Date = dto.Date,
            Description = dto.Description,
            Type = dto.Type,
            CategoryId = dto.CategoryId,
            UserId = CurrentUserId
        };

        await _transactionRepository.AddAsync(transaction);
        await _transactionRepository.SaveChangesAsync();

        var result = new TransactionDto
        {
            Id = transaction.Id,
            Amount = transaction.Amount,
            Date = transaction.Date,
            Description = transaction.Description,
            Type = transaction.Type,
            CategoryId = transaction.CategoryId,
            CategoryName = category.Name
        };

        return CreatedAtAction(nameof(GetById), new { id = transaction.Id }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, CreateTransactionDto dto)
    {
        var transaction = await _transactionRepository.GetByIdAsync(id);
        if (transaction == null || transaction.UserId != CurrentUserId) return NotFound();

        var category = await _categoryRepository.GetByIdAsync(dto.CategoryId);
        if (category == null || category.UserId != CurrentUserId)
            return BadRequest("Invalid category.");

        transaction.Amount = dto.Amount;
        transaction.Date = dto.Date;
        transaction.Description = dto.Description;
        transaction.Type = dto.Type;
        transaction.CategoryId = dto.CategoryId;

        _transactionRepository.Update(transaction);
        await _transactionRepository.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var transaction = await _transactionRepository.GetByIdAsync(id);
        if (transaction == null || transaction.UserId != CurrentUserId) return NotFound();

        _transactionRepository.Delete(transaction);
        await _transactionRepository.SaveChangesAsync();

        return NoContent();
    }
}
