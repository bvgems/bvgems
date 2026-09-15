"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Container, Title, Table, Badge, Loader, Center, Paper, Text, Button } from "@mantine/core";
import axios from "axios";
import { notifications } from "@mantine/notifications";

type Account = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  phone_number: string;
  is_approved: boolean;
  is_memo_purchase_approved: boolean;
  created_at: string;
};

export default function AdminAccountsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  const allowedEmails = [
    "sales@bvgems.com",
    "meet.vikartr@gmail.com",
    "shrey@gmail.com",
  ];

  useEffect(() => {
    if (!authLoading) {
      if (!user || !allowedEmails.includes(user.email)) {
        router.push("/");
      } else {
        fetchAccounts();
      }
    }
  }, [user, authLoading, router]);

  const fetchAccounts = async () => {
    try {
      setLoadingAccounts(true);
      const res = await axios.get("/api/admin/accounts");
      setAccounts(res.data.accounts || []);
    } catch (error) {
      console.error("Error fetching accounts:", error);
    } finally {
      setLoadingAccounts(false);
    }
  };

  const toggleMemoAccess = async (id: string, currentStatus: boolean) => {
    try {
      const newStatus = !currentStatus;
      await axios.patch("/api/admin/accounts/toggle-memo", {
        id,
        is_memo_purchase_approved: newStatus,
      });
      
      setAccounts((prevAccounts) =>
        prevAccounts.map((acc) =>
          acc.id === id ? { ...acc, is_memo_purchase_approved: newStatus } : acc
        )
      );

      notifications.show({
        title: "Success",
        message: `Memo access has been ${newStatus ? "granted" : "revoked"}.`,
        color: "green",
      });
    } catch (error) {
      console.error("Error toggling memo access:", error);
      notifications.show({
        title: "Error",
        message: "Failed to update memo access.",
        color: "red",
      });
    }
  };

  if (authLoading || (user && !allowedEmails.includes(user.email))) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="xl" color="#0b182d" />
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={2} mb="xl" style={{ color: "#0b182d" }}>
        Admin Dashboard: Approved Accounts
      </Title>

      <Paper shadow="sm" radius="md" p="md" withBorder>
        {loadingAccounts ? (
          <Center py="xl">
            <Loader color="#0b182d" />
          </Center>
        ) : accounts.length === 0 ? (
          <Text ta="center" color="dimmed" py="xl">
            No approved accounts found.
          </Text>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <Table striped highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Company</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Phone</Table.Th>
                  <Table.Th>Wholesale Account</Table.Th>
                  <Table.Th>Memo Program</Table.Th>
                  <Table.Th>Joined Date</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {accounts.map((acc) => (
                  <Table.Tr key={acc.id}>
                    <Table.Td>
                      {acc.first_name} {acc.last_name}
                    </Table.Td>
                    <Table.Td>{acc.company_name || "-"}</Table.Td>
                    <Table.Td>{acc.email}</Table.Td>
                    <Table.Td>{acc.phone_number || "-"}</Table.Td>
                    <Table.Td>
                      {acc.is_approved ? (
                        <Badge color="teal" variant="light">
                          Approved
                        </Badge>
                      ) : (
                        <Badge color="gray" variant="light">
                          Pending/Denied
                        </Badge>
                      )}
                    </Table.Td>
                    <Table.Td>
                      <div className="flex items-center gap-2">
                        {acc.is_memo_purchase_approved ? (
                          <Badge color="blue" variant="light">
                            Memo Active
                          </Badge>
                        ) : (
                          <Badge color="gray" variant="light">
                            No Memo
                          </Badge>
                        )}
                        {(user?.email === "meet.vikartr@gmail.com" || user?.email === "shrey@gmail.com") && (
                          <Button
                            size="xs"
                            variant="subtle"
                            color={acc.is_memo_purchase_approved ? "red" : "teal"}
                            onClick={() => toggleMemoAccess(acc.id, acc.is_memo_purchase_approved)}
                          >
                            {acc.is_memo_purchase_approved ? "Revoke" : "Grant"}
                          </Button>
                        )}
                      </div>
                    </Table.Td>
                    <Table.Td>
                      {new Date(acc.created_at).toLocaleDateString()}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </div>
        )}
      </Paper>
    </Container>
  );
}
