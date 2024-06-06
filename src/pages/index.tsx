import { type InvalidateQueryFilters, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import Head from "next/head";
import Layout from "~/components/layout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { fetchData } from "~/utils";
import type { ReturnType } from "./api/voyage/getAll";
import { Button } from "~/components/ui/button";
import { TABLE_DATE_FORMAT } from "~/constants";
import { useState } from "react";
import { Sheet, SheetContent } from "~/components/ui/sheet";
import {
  ToastProvider,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastViewport,
} from "~/components/ui/toast";
import VoyageForm from "~/components/voyageForm";

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "~/components/ui/popover";

export default function Home() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{message: string | null, isError?: boolean}>({message: null, isError: false});

  const { data: voyages } = useQuery<ReturnType>({
    queryKey: ["voyages"],
    queryFn: () => fetchData("voyage/getAll"),
  });

  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (voyageId: string) => {
      const response = await fetch(`/api/voyage/delete?id=${voyageId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete the voyage");
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["voyages"] } as InvalidateQueryFilters);
    },
    onError: () => {
      setToastMessage({message: 'Voyage has not been deleted successfully!', isError: true});
    },
  });

  const handleDelete = (voyageId: string) => {
    mutation.mutate(voyageId);
  };

  return (
    <>
      <Head>
        <title>Voyages | DFDS</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
      <ToastProvider>
      <Button
            onClick={() => setIsSheetOpen(true)}
            className="my-3 self-start bg-gray-800 text-white"
          >
            Create Voyage
          </Button>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent>
              <h2 className="text-lg font-semibold mb-3">Create Voyage</h2>
              <VoyageForm onClose={() => setIsSheetOpen(false)} setToastMessage={setToastMessage}/>
            </SheetContent>
          </Sheet>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Port of loading</TableHead>
              <TableHead>Port of discharge</TableHead>
              <TableHead>Vessel</TableHead>
              <TableHead>Unit Types</TableHead>
              <TableHead>&nbsp;</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {voyages?.map((voyage) => (
              <TableRow key={voyage.id}>
                <TableCell>
                  {format(new Date(voyage.scheduledDeparture), TABLE_DATE_FORMAT)}
                </TableCell>
                <TableCell>
                  {format(new Date(voyage.scheduledArrival), TABLE_DATE_FORMAT)}
                </TableCell>
                <TableCell>{voyage.portOfLoading}</TableCell>
                <TableCell>{voyage.portOfDischarge}</TableCell>
                <TableCell>{voyage.vessel.name}</TableCell>
                <TableCell>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="link">{voyage.unitTypes.length}</Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <div className="p-4">
                        <h4 className="font-bold mb-3">Unit Types:</h4>
                        <ul>
                          {voyage.unitTypes.map((unitType) => (
                            <li key={unitType.id} className="mb-4">
                              <p>
                                 {unitType.name}
                              </p>
                              <p className="text-sm">
                                Default Length: {unitType.defaultLength}
                              </p> 
                            </li>
                          ))}
                        </ul>
                      </div>
                    </PopoverContent>
                  </Popover>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleDelete(voyage.id)} variant="outline">
                    X
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {toastMessage.message && (
            <Toast onOpenChange={() => setToastMessage({message: null, isError: false})}>
              <ToastTitle className={toastMessage.isError ? "text-red-500" : ''}>{toastMessage.isError ? 'Failed:' : 'Succeded'}</ToastTitle>
              <ToastDescription className={toastMessage.isError ? "text-red-500" : ''}>{toastMessage.message}</ToastDescription>
              <ToastClose />
            </Toast>
          )}
          <ToastViewport />
      </ToastProvider>
      </Layout>
    </>
  );
}
