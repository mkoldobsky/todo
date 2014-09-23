using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using Todo.API.ViewModels;
using Todo.Data;
using Todo.Data.Infrastructure;
using Todo.Model;
using Todo.Model.Models;
using Todo.Services;

namespace Todo.API.Controllers
{

    [RoutePrefix("agenda")]
    public class TodoController : ApiController
    {
        private ITodoService _service;

        /// <summary>
        /// Handles initializing shared properties
        /// </summary>
        public TodoController(ITodoService service)
        {
            _service = service;
        }

        [Authorize]
        [Route("{date}")]
        public IHttpActionResult Get(DateTime date)
        {
            var result = _service.GetByDate(date).ToList();
            if (!result.Any())
                return Ok(EmptyDate(date));
            var dateViewModel = GetDateViewModel(date, result);
            return Ok(dateViewModel);
        }

        [Authorize]
        [Route("month/{month}/{year}")]
        [HttpGet]
        public IHttpActionResult Get(int month, int year)
        {
            var date = new DateTime(year, month, 1).StartOfWeek(DayOfWeek.Sunday);
            var lastDate = new DateTime(year, month, DateTime.DaysInMonth(year, month));
            var result = new List<DateViewModel>();
            for (int i = 0; i < 42; i++)
            {
                var dateResult = _service.GetByDate(date).ToList();
                result.Add(!dateResult.Any() ? EmptyDate(date) : GetDateViewModel(date, dateResult));
                date = date.AddDays(1);

            }
            return Ok(result);
        }


        [Authorize]
        [Route("week/{day}/{month}/{year}")]
        [HttpGet]
        public IHttpActionResult Get(int day, int month, int year)
        {
            var date = new DateTime(year, month, day).StartOfWeek(DayOfWeek.Sunday);

            var result = new List<DateViewModel>();

            for (int i = 0; i < 7; i++)
            {
                var dateResult = _service.GetByDate(date).ToList();
                result.Add(!dateResult.Any() ? EmptyDate(date) : GetDateViewModel(date, dateResult));
                date = date.AddDays(1);

            }
            return Ok(result);
        }

        private static DateViewModel EmptyDate(DateTime date)
        {
            return new DateViewModel
            {
                date = date,
                weekDay = date.DayOfWeek.ToString(),
                capacity = 0,
                remains = 0,
                schedules =
                    new List<ScheduleViewModel>
                    {
                        new ScheduleViewModel {capacity = 0, name = "Mañana", remains = 0, date = date},
                        new ScheduleViewModel {capacity = 0, name = "Tarde", remains = 0, date = date}
                    }
            };
        }

        [Authorize]
        [Route("schedule")]
        [HttpPut]
        public IHttpActionResult Update(CapacityViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var schedule = new Schedule();
                    Mapper.Map(viewModel, schedule);
                    return Ok(_service.UpdateCapacity(schedule));
                }
                catch (Exception ex)
                {

                    return BadRequest(ex.Message);
                }
            }
            return BadRequest(ModelState);
        }
        private static DateViewModel GetDateViewModel(DateTime date, List<Schedule> result)
        {
            var schedules = result.ToList();

            var dateViewModel = new DateViewModel
            {
                capacity = schedules.Sum(x => x.Capacity),
                remains = schedules.Sum(x => x.Capacity) - schedules.Sum(x => x.Prospects.Count),
                date = date,
                weekDay = date.DayOfWeek.ToString()
            };
            var schedulesViewModel = new List<ScheduleViewModel>();
            Mapper.Map(schedules, schedulesViewModel);
            foreach (var scheduleViewModel in schedulesViewModel)
            {
                scheduleViewModel.remains = scheduleViewModel.capacity - scheduleViewModel.prospects.Count;
            }

            dateViewModel.schedules = schedulesViewModel;
            foreach (var schedule in schedules)
            {
                var prospectsViewModel = new List<ProspectViewModel>();
                Mapper.Map(schedule.Prospects, prospectsViewModel);
                dateViewModel.prospects.AddRange(prospectsViewModel);
            }
            return dateViewModel;
        }

        [Authorize]
        [Route("prospect")]
        [HttpPost]
        public IHttpActionResult Post(ProspectViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var prospect = new Prospect
                    {
                        Companyid = viewModel.companyId,
                        Name = viewModel.name,
                        ScheduleId = viewModel.scheduleId
                    };

                    var result = _service.CreateProspect(prospect);
                    if (result != null)
                    {
                        var prospectViewModel = new ProspectViewModel();
                        Mapper.Map(result, prospectViewModel);
                        return Ok(prospectViewModel);
                    }
                }
                catch (Exception ex)
                {

                    BadRequest(ex.Message);
                }
            }
            return BadRequest(ModelState);
        }

        [Authorize]
        [Route("prospect")]
        [HttpPut]
        public IHttpActionResult Put(ProspectViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {

                    var prospect = _service.GetProspectById(viewModel.id);

                    prospect.Name = viewModel.name;
                    prospect.Companyid = viewModel.companyId;

                    var result = _service.UpdateProspect(prospect);
                    Ok(true);
                }
                catch (Exception ex)
                {

                    BadRequest(ex.Message);
                }
            }
            return BadRequest(ModelState);
        }

        [Authorize]
        [Route("prospect")]
        [HttpDelete]
        public IHttpActionResult Delete(ProspectViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var prospect = new Prospect();
                    Mapper.Map(viewModel, prospect);
                    return Ok(_service.DeleteProspect(prospect));
                }
                catch (Exception ex)
                {

                    BadRequest(ex.Message);
                }
            }
            return BadRequest(ModelState);
        }

        [Authorize]
        [Route("schedule")]
        [HttpPost]
        public IHttpActionResult Post(ScheduleViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var schedule = new Schedule
                    {
                        Name = viewModel.name,
                        Capacity = viewModel.capacity,
                        Date = viewModel.date,
                    };

                    var result = _service.CreateSchedule(schedule);
                    if (result != null)
                    {
                        var scheduleViewModel = new ScheduleViewModel();
                        Mapper.Map(result, scheduleViewModel);
                        return Ok(scheduleViewModel);
                    }
                }
                catch (Exception ex)
                {

                    BadRequest(ex.Message);
                }
            }
            return BadRequest(ModelState);
        }

    

    }
}