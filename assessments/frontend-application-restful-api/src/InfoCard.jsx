import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const InfoCard = ({
  title,
  description,
  method,
  url,
  requestBody,
  responseBody,
}) => {
  return (
    <div className="p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm">
              <strong className="font-semibold">HTTP Method:</strong> {method}
            </p>
            <p className="text-sm">
              <strong className="font-semibold">Endpoint URL:</strong> {url}
            </p>
            <p className="text-sm">
              <strong className="font-semibold">Request Body:</strong>
            </p>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(requestBody, null, 2)}
            </pre>
            <p className="text-sm mt-2">
              <strong className="font-semibold">Response Body:</strong>
            </p>
            <pre className="bg-gray-100 p-2 rounded text-sm">
              {JSON.stringify(responseBody, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoCard;
