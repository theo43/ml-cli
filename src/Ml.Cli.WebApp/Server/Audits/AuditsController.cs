using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Ml.Cli.WebApp.Server.Audits.Database;
using Ml.Cli.WebApp.Server.Oidc;

namespace Ml.Cli.WebApp.Server.Audits
{
    [Route("api/server/[controller]")]
    [ApiController]
    [Authorize(Roles = Roles.DataScientist)]
    public class AuditsController : Controller
    {
        [HttpGet("{type}/{id}")]
        [ResponseCache(Duration = 1)]
        public async Task<ActionResult<IList<Audit>>> GetAllAudits([FromServices] AuditsRepository auditsRepository, string id, string type)
        {
            var audits = await auditsRepository.FindByElementIdAsync(id);
            if (audits.Count == 0)
            {
                return NoContent();
            }
            return Ok(audits);
        }
        
        [HttpGet("{type}/{id}/{index}")]
        [ResponseCache(Duration = 1)]
        public async Task<ActionResult<string>> GetAuditedData([FromServices] AuditsRepository auditsRepository, [FromServices] AuditsService auditsService, string id, string type, int index)
        {
            var data = await auditsService.GetDataAsync(auditsRepository, type, id, index);
            if (string.IsNullOrEmpty(data))
            {
                return NoContent();
            }
            return Ok(data);
        }


    }
}
