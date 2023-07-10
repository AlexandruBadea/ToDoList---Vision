using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace ToDoList.Models
{
    public class ToDoItem
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        [DefaultValue(false)]
        public bool isCompleted { get; set; }

    }
}
