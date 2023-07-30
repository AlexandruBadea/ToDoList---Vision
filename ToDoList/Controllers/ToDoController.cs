using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using ToDoList.Models;

namespace ToDoList.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ToDoController : ControllerBase
    {
        private readonly ToDoDbContext _context;

        public ToDoController(ToDoDbContext context)
        {
            _context = context;
        }

        [HttpGet("api/getAll", Name = "GetAllToDoItems")]
        public IEnumerable<ToDoItem> GetAll()
        {
            return _context.ToDoItems.ToList();
        }

        [HttpGet("api/getbyid/{id}", Name = "GetToDoItem")]
        public ActionResult<ToDoItem> GetItemById(int id)
        {
            var item = _context.ToDoItems.FirstOrDefault(x => x.Id == id);
            if (item == null)
            {
                return NotFound();
            }
            return item;
        }

        [HttpPost("api/create")]
        public IActionResult CreateItem(ToDoItem item)
        {
            _context.ToDoItems.Add(item);
            _context.SaveChanges();

            return CreatedAtRoute("GetToDoItem", new { id = item.Id }, item);
        }

        [HttpPut("api/update/{id}")]
        public IActionResult Update(int id, ToDoItem item)
        {
            var existingItem = _context.ToDoItems.FirstOrDefault(x => x.Id == id);
            if (existingItem == null)
            {
                return NotFound();
            }

            existingItem.Title = item.Title;
            existingItem.Description = item.Description;
            existingItem.isCompleted = item.isCompleted;

            _context.SaveChanges();

            return CreatedAtRoute("GetToDoItem", new { id = existingItem.Id }, existingItem);
        }

        [HttpDelete("api/delete/{id}")]
        public IActionResult Delete(int id)
        {
            var item = _context.ToDoItems.FirstOrDefault(x => x.Id == id);
            if (item == null)
            {
                return NotFound();
            }

            _context.ToDoItems.Remove(item);
            _context.SaveChanges();

            return NoContent();
        }

        [HttpPut("api/markCompleted/{id}")]
        public IActionResult MarkCompleted(int id)
        {
            var item = _context.ToDoItems.FirstOrDefault(x => x.Id == id);
            if (item == null)
            {
                return NotFound();
            }

            item.isCompleted = true;
            _context.SaveChanges();

            return Ok(item);
        }

        [HttpPut("api/markUncompleted/{id}")]
        public IActionResult MarkUncompleted(int id)
        {
            var item = _context.ToDoItems.FirstOrDefault(x => x.Id == id);
            if (item == null)
            {
                return NotFound();
            }

            item.isCompleted = false;
            _context.SaveChanges();

            return Ok(item);
        }

    }
}