import {
  Text,
  Group,
  Button,
  Modal,
  Paper,
  Title,
  Table,
  TableThead,
  TableTr,
  TableTh,
  TableTbody,
  TableTd,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconCheck,
  IconX,
  IconUserShare,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import { deleteReference, getBusinessReferences } from "@/apis/api";
import { notifications } from "@mantine/notifications";
import { BusinessReferenceForm } from "./BusinessReferenceForm";

export const BusinessReference = () => {
  const { user }: any = useUserStore();

  const [references, setReferences] = useState<any[]>([]);
  const [editingReference, setReferenceAddress] = useState<any>(null);
  const [modalOpened, { open, close }] = useDisclosure(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);

  const fetchReferences = async () => {
    if (!user?.id) return;
    const res = await getBusinessReferences(user.id);
    const fetched = res?.businessReferences || [];
    setReferences(fetched);
  };

  useEffect(() => {
    fetchReferences();
  }, [user?.id]);

  const referencesRows = references?.map((reference: any, index: number) => (
    <React.Fragment key={reference.id}>
      <TableTr className="cursor-pointer">
        <TableTd>{index + 1}</TableTd>
        <TableTd>{reference?.company_name}</TableTd>
        <TableTd>{reference?.contact_person}</TableTd>
        <TableTd>{reference?.contact_number}</TableTd>
        <TableTd>{reference?.company_address}</TableTd>
        <TableTd className="flex flex-row items-center gap-2.5">
          <IconEdit
            onClick={(e) => {
              e.stopPropagation();
              setReferenceAddress(reference);
              open();
            }}
            size={"22"}
            color="green"
          />
          <IconTrash
            onClick={(e) => {
              e.stopPropagation();
              setToDeleteId(reference.id);
              setDeleteModalOpened(true);
            }}
            size={"22"}
            color="red"
          />
        </TableTd>
      </TableTr>
    </React.Fragment>
  ));

  const handleDelete = async () => {
    if (toDeleteId) {
      const response = await deleteReference(toDeleteId);
      if (response.flag) {
        notifications.show({
          icon: <IconCheck />,
          message: response.message,
          position: "top-right",
          color: "teal",
        });
      } else {
        notifications.show({
          icon: <IconX />,
          message: "Delete failed",
          position: "top-right",
          color: "red",
        });
      }
      setToDeleteId(null);
      setDeleteModalOpened(false);
      fetchReferences();
    }
  };

  return (
    <div>
      {references?.length === 0 ? (
        <Paper p="xl" radius="md" className="text-center">
          <div className="flex justify-center mb-3">
            <IconUserShare size={48} color="violet" />
          </div>
          <Title order={3} mb="sm">
            Business Reference Needed
          </Title>
          <Text c="dimmed" mb="md">
            To proceed with memo orders, we require a valid business reference.
            Please add your company details and a primary contact so we can
            verify your eligibility.
          </Text>
          <Button
            color="violet"
            onClick={() => {
              setReferenceAddress(null);
              open();
            }}
          >
            Add Business Reference
          </Button>
        </Paper>
      ) : (
        <Table
          horizontalSpacing={"md"}
          highlightOnHover
          striped
          stickyHeaderOffset={60}
        >
          <TableThead>
            <TableTr className="font-extrabold text-[15px] text-violet-800">
              <TableTh>Reference#</TableTh>
              <TableTh>Company Name</TableTh>
              <TableTh>Contact Person</TableTh>
              <TableTh>Contact Number</TableTh>
              <TableTh>Company Person</TableTh>
              <TableTh>Action</TableTh>
            </TableTr>
          </TableThead>
          <TableTbody>{referencesRows}</TableTbody>
        </Table>
      )}
      {references?.length ? (
        <Button
          mt="md"
          color="violet"
          onClick={() => {
            setReferenceAddress(null);
            open();
          }}
        >
          Add New Reference
        </Button>
      ) : null}
      <Modal
        opened={modalOpened}
        onClose={close}
        centered
        title={editingReference ? "Edit Reference" : "Add Reference"}
      >
        <BusinessReferenceForm
          userId={user?.id}
          referenceData={editingReference}
          onSuccess={() => {
            fetchReferences();
            close();
          }}
        />
      </Modal>

      <Modal
        opened={deleteModalOpened}
        onClose={() => setDeleteModalOpened(false)}
        title="Delete Address"
        centered
      >
        <Text>Are you sure you want to delete this reference?</Text>
        <Group mt="md" justify="flex-end">
          <Button variant="default" onClick={() => setDeleteModalOpened(false)}>
            Cancel
          </Button>
          <Button color="red" onClick={handleDelete}>
            Delete
          </Button>
        </Group>
      </Modal>
    </div>
  );
};
