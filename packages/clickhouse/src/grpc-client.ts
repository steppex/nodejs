import * as path from "path";
import { promisify } from "util";
import { loadSync } from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
const packageDefinition = loadSync(
    path.join(__dirname, "./protos/clickhouse_grpc.proto"),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true,
    },
);
const protoDescriptor = grpc.loadPackageDefinition(packageDefinition);
const chRpc = protoDescriptor["clickhouse"]["grpc"];
const service: grpc.ServiceClientConstructor = chRpc["ClickHouse"];
const address = "jpc:19100";
const client = new service(address, grpc.credentials.createInsecure(), {
    "grpc.keepalive_permit_without_calls": 1,
    "grpc.max_send_message_length": -1,
});
const query = promisify(client["ExecuteQuery"]).bind(client);
// const query = client['ExecuteQueryWithStreamOutput'].bind(client);
(async () => {
    const data = {
        query: "select  from agile_workload_entries limit 10",
        database: "pc_ch_db",
        // settings: {
        //   extremes: 1,
        // },
        output_format: "JSON",
        send_output_columns: true,
    };
    const result = await query(data);
    console.log(result);
    const res = {
        output: toJson(result.output),
        totals: toJson(result.totals),
        extremes: toJson(result.extremes),
    };
    console.log(res);
})();

function toJson(buf) {
    // return buf.toString('utf-8');
    return JSON.parse(buf.toString("utf-8") || null);
}
