using ExpenseTracker.Core.DTOs;
using ExpenseTracker.Core.Interfaces;
using ExpenseTracker.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ExpenseTracker.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
public class DefaultCategoriesController : ControllerBase
{
    private readonly IDefaultCategoryRepository _defaultCategoryRepository;

    public DefaultCategoriesController(IDefaultCategoryRepository defaultCategoryRepository)
    {
        _defaultCategoryRepository = defaultCategoryRepository;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<DefaultCategoryDto>>> GetAll()
    {
        var categories = await _defaultCategoryRepository.GetAllAsync();
        var dto = categories.Select(c => new DefaultCategoryDto
        {
            Id = c.Id,
            Name = c.Name,
            Type = c.Type
        });
        return Ok(dto);
    }
}
