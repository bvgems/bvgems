import { Text, List, Anchor, Accordion, Center } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

interface Node {
  type: string;
  value?: string;
  level?: number;
  url?: string;
  children?: Node[];
  listType?: "unordered" | "ordered";
}

const AccordionControl = (props: any) => (
  <Center>
    <Accordion.Control {...props} />
  </Center>
);

const RichTextRenderer = ({ content }: any) => {
  if (!content || !content.children) return null;

  const accordionItems: { heading: Node; content: Node[] }[] = [];
  let currentHeading: Node | null = null;
  let currentContent: Node[] = [];

  content.children.forEach((node: Node) => {
    if (node.type === "heading") {
      if (currentHeading) {
        accordionItems.push({
          heading: currentHeading,
          content: currentContent,
        });
      }
      currentHeading = node;
      currentContent = [];
    } else {
      currentContent.push(node);
    }
  });

  if (currentHeading) {
    accordionItems.push({ heading: currentHeading, content: currentContent });
  }

  const renderNode = (node: Node, key: string) => {
    switch (node.type) {
      case "paragraph":
        return (
          <Text key={key} size="md">
            {node.children?.map((child, index) =>
              renderNode(child, `${key}-${index}`)
            )}
          </Text>
        );

      case "text":
        return node.value;

      case "bold":
        return <strong key={key}>{node.value}</strong>;

      case "list":
        return (
          <List
            key={key}
            type={node.listType === "ordered" ? "ordered" : "unordered"}
            spacing="xs"
            pl="md"
          >
            {node.children?.map((child, index) =>
              renderNode(child, `${key}-${index}`)
            )}
          </List>
        );

      case "list-item":
        return (
          <List.Item key={key}>
            {node.children?.map((child, index) =>
              renderNode(child, `${key}-${index}`)
            )}
          </List.Item>
        );

      case "link":
        return (
          <Anchor
            key={key}
            href={node.url}
            target="_blank"
            rel="noopener noreferrer"
            color="grape"
          >
            {node.children?.map((child, index) =>
              renderNode(child, `${key}-${index}`)
            )}
          </Anchor>
        );

      default:
        return null;
    }
  };

  return (
    <Accordion
      chevron={<IconPlus color="#5d0ec0" size={16} />}
      chevronPosition="left"
      variant="default"
      defaultValue={accordionItems.map(
        (item, index) => item.heading.value || `item-${index}`
      )}
      multiple
      transitionDuration={600}
    >
      {accordionItems.map((item, index) => (
        <Accordion.Item
          key={index}
          value={item.heading.value || `item-${index}`}
        >
          <AccordionControl>
            <Text style={{ color: "#5d0ec0" }} fw={700}>
              {item.heading.children?.map((child, idx) =>
                renderNode(child, `heading-${index}-${idx}`)
              )}
            </Text>
          </AccordionControl>
          <Accordion.Panel>
            <List withPadding>
              {item.content.map((node, idx) => (
                <List.Item key={`content-${index}-${idx}`}>
                  {renderNode(node, `content-${index}-${idx}`)}
                </List.Item>
              ))}
            </List>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
};

export default RichTextRenderer;
