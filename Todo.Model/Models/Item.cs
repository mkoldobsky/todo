using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Todo.Model.Models
{
    public class Item
    {
        public int Id { get; set; }
        public ApplicationUser ApplicationUser { get; set; }
        public string Description { get; set; }
        public bool Done { get; set; }
        public DateTime From { get; set; }
        public DateTime To { get; set; }
    }
}
