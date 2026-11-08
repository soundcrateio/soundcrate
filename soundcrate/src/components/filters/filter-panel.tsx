"use client"

import { useFilters } from "@/components/filters/filters-provider"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"

function CheckboxList({
  facet,
  legend,
  idPrefix,
}: {
  facet: "genres" | "daws" | "synths"
  legend: string
  idPrefix: string
}) {
  const { filters, options, toggleValue } = useFilters()
  return (
    <FieldSet>
      <FieldLegend className="sr-only">{legend}</FieldLegend>
      <FieldGroup data-slot="checkbox-group">
        {options[facet].map((opt) => {
          const id = `${idPrefix}-${facet}-${opt.slug}`
          return (
            <Field key={opt.slug} orientation="horizontal">
              <Checkbox
                id={id}
                checked={filters[facet].includes(opt.slug)}
                onCheckedChange={() => toggleValue(facet, opt.slug)}
              />
              <FieldLabel htmlFor={id} className="font-normal">
                {opt.name}
              </FieldLabel>
            </Field>
          )
        })}
      </FieldGroup>
    </FieldSet>
  )
}

function SectionTitle({ title, count }: { title: string; count: number }) {
  return (
    <span className="flex items-center gap-2">
      {title}
      {count > 0 && <Badge variant="secondary">{count}</Badge>}
    </span>
  )
}

/**
 * The filter controls. Rendered in the desktop sidebar and inside the
 * mobile sheet — `idPrefix` keeps checkbox ids unique between the two.
 */
export function FilterPanel({ idPrefix = "f" }: { idPrefix?: string }) {
  const { filters, setFilters } = useFilters()

  const contentCount =
    Number(filters.midi) + Number(filters.presets) + Number(filters.free)

  return (
    <Accordion
      type="multiple"
      defaultValue={["contents", "genres", "daws", "synths"]}
      className="w-full"
    >
      <AccordionItem value="contents">
        <AccordionTrigger>
          <SectionTitle title="Includes" count={contentCount} />
        </AccordionTrigger>
        <AccordionContent>
          <FieldSet>
            <FieldLegend className="sr-only">Pack contents</FieldLegend>
            <FieldGroup data-slot="checkbox-group">
              <Field orientation="horizontal">
                <Checkbox
                  id={`${idPrefix}-midi`}
                  checked={filters.midi}
                  onCheckedChange={(v) => setFilters({ midi: v === true })}
                />
                <FieldLabel htmlFor={`${idPrefix}-midi`} className="font-normal">
                  MIDI files
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  id={`${idPrefix}-presets`}
                  checked={filters.presets}
                  onCheckedChange={(v) => setFilters({ presets: v === true })}
                />
                <FieldLabel htmlFor={`${idPrefix}-presets`} className="font-normal">
                  Synth presets
                </FieldLabel>
              </Field>
              <Field orientation="horizontal">
                <Checkbox
                  id={`${idPrefix}-free`}
                  checked={filters.free}
                  onCheckedChange={(v) => setFilters({ free: v === true })}
                />
                <FieldLabel htmlFor={`${idPrefix}-free`} className="font-normal">
                  Free packs only
                </FieldLabel>
              </Field>
            </FieldGroup>
          </FieldSet>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="genres">
        <AccordionTrigger>
          <SectionTitle title="Genre" count={filters.genres.length} />
        </AccordionTrigger>
        <AccordionContent>
          <CheckboxList facet="genres" legend="Genre" idPrefix={idPrefix} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="daws">
        <AccordionTrigger>
          <SectionTitle title="DAW" count={filters.daws.length} />
        </AccordionTrigger>
        <AccordionContent>
          <CheckboxList facet="daws" legend="DAW" idPrefix={idPrefix} />
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="synths">
        <AccordionTrigger>
          <SectionTitle title="Presets for" count={filters.synths.length} />
        </AccordionTrigger>
        <AccordionContent>
          <CheckboxList facet="synths" legend="Presets for synth" idPrefix={idPrefix} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
