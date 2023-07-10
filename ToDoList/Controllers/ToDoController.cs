using Microsoft.AspNetCore.Mvc;
using ToDoList.Models;

namespace ToDoList.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ToDoController : ControllerBase
    {
        private static List<ToDoItem> _listItems { get; set; } = new List<ToDoItem>();



        [HttpGet("getAll", Name ="GetAllToDoItems")]
        public IEnumerable<ToDoItem> GetAll()
        {
            return _listItems;
        }

        [HttpGet("getbyid/{id}", Name = "GetToDoItem")]
        public ActionResult<ToDoItem> GetItemById(int id)
        {
            var item = _listItems.FirstOrDefault(x => x.Id == id);
            if (item == null)
            {
                return NotFound();
            }
            return item;
        }

        [HttpPost("create")]
        public IActionResult CreateItem(ToDoItem item)
        {
            _listItems.Add(item);
            return CreatedAtRoute("GetToDoItem", new { id = item.Id}, item);
        }

        [HttpPut("update/{id}")]
        public IActionResult Update(int id, ToDoItem item)
        {
            var filter = _listItems.FirstOrDefault(x => x.Id == id);
            if (item == null)
            {
                return NotFound();
            }

            filter.Title = item.Title;
            filter.Description = item.Description;
            filter.isCompleted = item.isCompleted;

            return CreatedAtRoute("GetToDoItem", new { i = item.Id }, item); ;
        }

        [HttpDelete("delete/{id}")]
        public IActionResult Delete(int id)
        {
            var item = _listItems.FirstOrDefault(x => x.Id == id);
            if (item == null)
            {
                return NotFound();
            }

            _listItems.Remove(item);
            return NoContent();
        }
    
    }
}
