using System.Net;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;

using Microsoft.Xrm.Sdk;
using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Query;
using System.Runtime.Serialization;
using System.ServiceModel;
using Microsoft.PowerPlatform.Dataverse.Client;
using static Google.Protobuf.Reflection.GeneratedCodeInfo.Types;
using Newtonsoft.Json.Linq;

namespace FetchCrmAttachments
{
    public class ReadCrmAttachment
    {
        private readonly ILogger _logger;

        public ReadCrmAttachment(ILoggerFactory loggerFactory)
        {
            _logger = loggerFactory.CreateLogger<ReadCrmAttachment>();
        }

        [Function("GetCRMAnnotation")]
        public HttpResponseData Run([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequestData req)
        {
            //_logger.LogInformation("C# HTTP trigger function processed a request.");
            string strAttachmentData =ReadCRMData();
            
            var response = req.CreateResponse(HttpStatusCode.OK);
            response.Headers.Add("Content-Type", "text/plain; charset=utf-8");

            response.WriteString(strAttachmentData);

            return response;
        }
        public string ReadCRMData()
        {

            //string environment = "https://org53e65ff9.crm.dynamics.com";
            string environment = "org53e65ff9.crm";
            string clientId = "43fef29a-9ba3-4daf-b966-71f3f09fc700";
            string clientSecret = "RXD8Q~rUb4qfPqhX6YjbFpVdLDI5z88COTuHxaNI"; // This should be encrypted

           
            var connectionString = @$"Url=https://{environment}.dynamics.com;AuthType=ClientSecret;ClientId={clientId};ClientSecret={clientSecret};RequireNewInstance=true";
            var serviceClient = new ServiceClient(connectionString);

            var query = new QueryExpression("annotation") { ColumnSet = new ColumnSet(true) };
            query.Criteria.AddCondition("objectid", ConditionOperator.Equal, "3cbbd39d-d3f0-ea11-a815-000d3a33f3c3");
            EntityCollection EntColl = serviceClient.RetrieveMultiple(query);

            Entity entity = EntColl.Entities[0];
            AttachmentData objAttachmentData = new AttachmentData();
            if (entity.Contains("annotationid"))
            {
                objAttachmentData.annotationid = entity["annotationid"].ToString();
            }
            if (entity.Contains("filename"))
            {
                objAttachmentData.filename = entity["filename"].ToString();
            }
            if (entity.Contains("documentbody"))
            {
                objAttachmentData.documentbody = entity["documentbody"].ToString();
            }
            if (entity.Contains("mimetype"))
            {
                objAttachmentData.mimetype = entity["mimetype"].ToString();
            }
            if (entity.Contains("objectid"))
            {
                objAttachmentData.objectid = ((EntityReference)entity["objectid"]).Id.ToString();
            }
            
            return Newtonsoft.Json.JsonConvert.SerializeObject(objAttachmentData);
        }
    }
    public class AttachmentData
    {
        public string? annotationid { get; set; }
        public string? filename { get; set; }
        public string? documentbody { get; set; }
        public string? mimetype { get; set; }
        public string? objectid { get; set; }
    }
}
